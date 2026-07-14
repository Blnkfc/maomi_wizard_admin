
export type DrinkGroup = 'milk' | 'fruit' | 'coffee' | 'special' | 'milkTea'

export type Temperature = 'hot' | 'cold' | 'room'


//base: tea | coffee | milk ?
//secondary: powder | syrup 
export type IngredientType = 'base' | 'secondary' | 'boba' | 'topping' | 'sweetener'

type Size =  'medium' | 'large'

export interface Ingredient {
    name: string;
    type: IngredientType;
    lactose: boolean;
    sweetness: number;
    sourness: number;
    bitterness: number;
    saltiness: number;
    compatibleWith: DrinkGroup[];
    availableTemperatures: Temperature[];
    customizableAmount?: boolean;
    amountRange?: [number, number] | 'user_specified';
    assignedColor?: string; 
}

interface Drink {
    group: DrinkGroup;
    ingredients: Ingredient[];
    size: Size;
    customizableSweetness: boolean;
    sweetness: number;
    temperature: Temperature; 
}