import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  RecipesService,
  CreateInstructionRequestDTO,
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
  }

  // init form
  initForm() {
    this.formGroup = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      cover_img_url: ['', [Validators.required]],
      cooking_time: [0, [Validators.required]],
      serving_size: [0, [Validators.required]],
      instructions: this.fb.array([]),
      recipeIngredients: this.fb.array([]),
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
      step_number: [0, [Validators.required, Validators.min(1)]],
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
    if (!this.formGroup.valid) return;

    const body = this.formGroup.value;

    this.isCreating = true;
    this.recipesService.createRecipe(body).subscribe({
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
}
