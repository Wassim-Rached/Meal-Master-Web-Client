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
import { ToastrService } from 'ngx-toastr';
import { MessagesService } from '../../../shared-module/services/messages.service';
import {
  faArrowDown,
  faArrowLeft,
  faArrowUp,
  faCarrot,
  faCheck,
  faList,
  faMortarPestle,
  faPlus,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-create-recipe',
  standalone: true,
  imports: [SharedModule, FontAwesomeModule],
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
    private measurmentsUnitsService: MeasurmentsUnitsService,
    private toastrService: ToastrService,
    private messagesService: MessagesService
  ) {}

  ngOnInit() {
    this.messagesService.pushMessage({
      type: 'success',
      content: 'Recipe created',
      link: {
        text: 'View Recipe',
        url: `/recipes/${1}`,
        type: 'internal',
      },
    });
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
      coverImgUrl: ['', [Validators.required]],
      cookingTime: [0],
      servingSize: [0, [Validators.required, Validators.min(1)]],
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
      stepNumber: [
        this.instructionsFormArray.length + 1,
        [Validators.required, Validators.min(1)],
      ],
      text: ['', [Validators.required]],
      timeEstimate: [0, [Validators.required, Validators.min(1)]],
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
    const body = this.formGroup.value;

    const cookingTime = body.instructions.reduce(
      (acc: number, curr: any) => acc + curr.timeEstimate,
      0
    );

    const requestBody: CreateRecipeRequestDTO = {
      title: body.title,
      description: body.description,
      coverImgUrl: body.coverImgUrl,
      cookingTime: cookingTime,
      servingSize: body.servingSize,
      instructions: body.instructions as CreateInstructionRequestDTO[],
      recipeIngredients:
        body.recipeIngredients as CreateRecipeIngredientRequestDTO[],
    };

    this.isCreating = true;
    this.recipesService.createRecipe(requestBody).subscribe({
      next: (res) => {
        this.toastrService.success('Recipe created successfully');

        this.isCreating = false;
      },
      error: (err) => {
        console.error(err);
        this.isCreating = false;
        this.toastrService.error(err.error || 'Failed to create recipe');
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

  get solidIcons() {
    return {
      faArrowDown,
      faArrowUp,
      faPlus,
      faTrashAlt,
      faArrowLeft,
      faCheck,
      faMortarPestle,
      faList,
    };
  }

  get imageUrl() {
    return this.formGroup.get('coverImgUrl')?.value;
  }
}
