import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared-module/shared-module.module';
import {
  CreateInstructionRequestDTO,
  CreateRecipeIngredientRequestDTO,
  Instruction,
  Recipe,
  RecipeIngredient,
  RecipesService,
  UpdateRecipeRequestDTO,
} from '../../../shared-module/services/recipes-service.service';
import {
  Ingredient,
  IngredientsService,
} from '../../../shared-module/services/ingredients.service';
import {
  MeasurementUnit,
  MeasurmentsUnitsService,
} from '../../../shared-module/services/measurments-units.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-recipe',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './update-recipe.component.html',
  styleUrl: './update-recipe.component.css',
})
export class UpdateRecipeComponent implements OnInit {
  formGroup!: FormGroup;
  isUpdating = false;
  recipe?: Recipe;
  availableIngredients: Ingredient[] = [];
  availableMeasurementUnits: MeasurementUnit[] = [];

  constructor(
    private fb: FormBuilder,
    private recipesService: RecipesService,
    private ingredientsService: IngredientsService,
    private measurmentsUnitsService: MeasurmentsUnitsService,
    private toastrService: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const recipeId = this.route.snapshot.params['id'];

    // fetch recipe
    this.refreshRecipe(recipeId);

    // fetch ingredients
    this.refreshIngredients();
    // fetch measurement units
    this.refreshMeasurementUnits();
  }

  refreshRecipe(recipeId: string) {
    this.recipe = undefined;
    this.recipesService.getRecipeById(recipeId).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
        this.initForm(recipe);
      },
      error: () => {
        this.toastrService.error('Failed to fetch recipe');
        this.recipe = undefined;
      },
    });
  }

  // init form
  initForm(recipe: Recipe) {
    this.formGroup = this.fb.group({
      title: [recipe.title, [Validators.required]],
      description: [recipe.description, [Validators.required]],
      coverImgUrl: [recipe.coverImgUrl, [Validators.required]],
      cookingTime: [undefined],
      servingSize: [
        recipe.servingSize,
        [Validators.required, Validators.min(1)],
      ],
      instructions: this.fb.array(
        [],
        [Validators.required, Validators.minLength(1)]
      ),
      recipeIngredients: this.fb.array(
        [],
        [Validators.required, Validators.minLength(1)]
      ),
    });

    // instructions
    recipe.instructions.forEach((instruction) => {
      this.addInstruction(instruction);
    });

    // recipe ingredients
    recipe.recipeIngredients.forEach((recipeIngredient) => {
      this.addRecipeIngredient(recipeIngredient);
    });
  }

  // requests
  refreshIngredients() {
    this.ingredientsService.getIngredients().subscribe((ingredients) => {
      this.availableIngredients = ingredients;
    });
  }

  refreshMeasurementUnits() {
    this.measurmentsUnitsService
      .getMeasurementUnits()
      .subscribe((measurementUnits) => {
        this.availableMeasurementUnits = measurementUnits;
      });
  }

  onSubmit() {
    if (!this.recipe || !this.formGroup.valid) return;

    this.isUpdating = true;

    const body = this.formGroup.value;

    const cookingTime = body.instructions.reduce(
      (acc: number, curr: any) => acc + curr.timeEstimate,
      0
    );

    const requestBody: UpdateRecipeRequestDTO = {
      title: body.title,
      description: body.description,
      coverImgUrl: body.coverImgUrl,
      cookingTime: cookingTime,
      servingSize: body.servingSize,
      instructions: body.instructions as CreateInstructionRequestDTO[],
      recipeIngredients:
        body.recipeIngredients as CreateRecipeIngredientRequestDTO[],
    };

    console.log(requestBody);

    this.recipesService.updateRecipe(this.recipe.id, requestBody).subscribe({
      next: (_) => {
        this.toastrService.success('Recipe updated successfully');
        this.isUpdating = false;
      },
      error: (error) => {
        this.isUpdating = false;
        const errorMessage = error.error || 'Failed to update recipe';
        this.toastrService.error(errorMessage);
      },
    });
  }

  // instructions related methods
  get instructionsFormArray(): FormArray {
    return this.formGroup.get('instructions') as FormArray;
  }

  addInstruction(oldInstruction?: Instruction) {
    const timeEstimateInit = oldInstruction?.timeEstimate || 0;
    const textInit = oldInstruction?.text || '';

    const instruction = this.fb.group({
      stepNumber: [
        this.instructionsFormArray.length + 1,
        [Validators.required, Validators.min(1)],
      ],
      text: [textInit, [Validators.required]],
      timeEstimate: [
        timeEstimateInit,
        [Validators.required, Validators.min(1)],
      ],
    });
    this.instructionsFormArray.push(instruction);
  }

  removeInstruction(index: number) {
    this.instructionsFormArray.removeAt(index);
  }

  // recipe ingredients related methods
  get recipeIngredientsFormArray(): FormArray {
    return this.formGroup.get('recipeIngredients') as FormArray;
  }

  addRecipeIngredient(oldRecipeIngredient?: RecipeIngredient) {
    const amountInit = oldRecipeIngredient?.amount || 0;
    const ingredientIdInit = oldRecipeIngredient?.ingredient.id || '';
    const measurementUnitIdInit = oldRecipeIngredient?.measurementUnit.id || '';

    const recipeIngredient = this.fb.group({
      amount: [amountInit, [Validators.required, Validators.min(1)]],
      ingredientId: [ingredientIdInit, [Validators.required]],
      measurementUnitId: [measurementUnitIdInit, [Validators.required]],
    });
    this.recipeIngredientsFormArray.push(recipeIngredient);
  }

  removeRecipeIngredient(index: number) {
    this.recipeIngredientsFormArray.removeAt(index);
  }

  moveInstructionUp(index: number) {
    if (index === 0) return;
    const instructions = this.instructionsFormArray.controls;
    const temp = instructions[index];
    instructions[index] = instructions[index - 1];
    instructions[index - 1] = temp;
  }
  moveInstructionDown(index: number) {
    const instructions = this.instructionsFormArray.controls;
    if (index === instructions.length - 1) return;
    const temp = instructions[index];
    instructions[index] = instructions[index + 1];
    instructions[index + 1] = temp;
  }
}
