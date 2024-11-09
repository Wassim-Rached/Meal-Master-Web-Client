import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  RecipesService,
  CreateInstructionRequestDTO,
  CreateRecipeRequestDTO,
  CreateRecipeIngredientRequestDTO,
} from '../../../shared-module/services/recipes-service.service';
import {
  Ingredient,
  IngredientsService,
} from '../../../shared-module/services/ingredients.service';
import {
  MeasurementUnit,
  MeasurmentsUnitsService,
} from '../../../shared-module/services/measurments-units.service';
import { SharedModule } from '../../../shared-module/shared-module.module';

@Component({
  selector: 'app-create-recipe',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './create-recipe.component.html',
  styleUrl: './create-recipe.component.css',
})
export class CreateRecipeComponent implements OnInit {
  formGroup!: FormGroup;
  availableIngredients: Ingredient[] = [];
  availableMeasurementUnits: MeasurementUnit[] = [];
  isCreating = false;

  constructor(
    private fb: FormBuilder,
    private recipesService: RecipesService,
    private ingredientsService: IngredientsService,
    private measurmentsUnitsService: MeasurmentsUnitsService
  ) {}

  ngOnInit() {
    // fetch ingredients
    this.refreshIngredients();
    // fetch measurement units
    this.refreshMeasurementUnits();

    // init form
    this.initForm();

    // add first instruction
    this.addInstruction();
    // add first recipe ingredient
    this.addRecipeIngredient();
  }

  // init form
  initForm() {
    this.formGroup = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      cover_img_url: ['', [Validators.required]],
      cooking_time: [0],
      serving_size: [0, [Validators.required, Validators.min(1)]],
      instructions: this.fb.array(
        [],
        [Validators.required, Validators.minLength(1)]
      ),
      recipeIngredients: this.fb.array(
        [],
        [Validators.required, Validators.minLength(1)]
      ),
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

  // instructions related methods
  get instructionsFormArray(): FormArray {
    return this.formGroup.get('instructions') as FormArray;
  }

  addInstruction() {
    const instruction = this.fb.group({
      step_number: [
        this.instructionsFormArray.length + 1,
        [Validators.required, Validators.min(1)],
      ],
      text: ['', [Validators.required]],
      time_estimate: [0, [Validators.required, Validators.min(1)]],
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

  addRecipeIngredient() {
    const recipeIngredient = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      ingredientId: ['', [Validators.required]],
      measurementUnitId: ['', [Validators.required]],
    });
    this.recipeIngredientsFormArray.push(recipeIngredient);
  }

  removeRecipeIngredient(index: number) {
    this.recipeIngredientsFormArray.removeAt(index);
  }

  // submit form
  onSubmit() {
    console.log(this.formGroup.valid);
    // log the problem
    console.log(this.formGroup.errors);
    console.log(this.formGroup.get('instructions')?.errors);
    console.log(this.formGroup.get('recipeIngredients')?.errors);
    console.log(this.formGroup.value);
    if (!this.formGroup.valid) return;

    const body = this.formGroup.value;

    const cookingTime = body.instructions.reduce(
      (acc: number, curr: any) => acc + curr.time_estimate,
      0
    );

    const requestBody: CreateRecipeRequestDTO = {
      title: body.title,
      description: body.description,
      cover_img_url: body.cover_img_url,
      cooking_time: cookingTime,
      serving_size: body.serving_size,
      instructions: body.instructions as CreateInstructionRequestDTO[],
      recipeIngredients:
        body.recipeIngredients as CreateRecipeIngredientRequestDTO[],
    };

    this.isCreating = true;
    this.recipesService.createRecipe(requestBody).subscribe({
      next: (res) => {
        alert('Recipe created successfully');
        this.isCreating = false;
      },
      error: (err) => {
        console.error(err);
        this.isCreating = false;
      },
    });
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
