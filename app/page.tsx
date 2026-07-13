'use client';
import Image, { StaticImageData } from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Ingredient, IngredientType } from './types/drink';
import SweetnessIcon from '../public/assets/sweetness.webp';
import SournessIcon from '../public/assets/sourness.webp';
import BitternessIcon from '../public/assets/bitterness.webp';
import SaltinessIcon from '../public/assets/saltiness.webp';
import { ChevronDown, Plus, Trash, X } from 'lucide-react';

const TOPICS = ['Ingredients', 'Specials'];
const INGREDIENT_TYPE_OPTIONS: IngredientType[] = ['base', 'secondary', 'boba', 'topping', 'sweetener'];
const INGREDIENT_COMPATIBILITY_OPTIONS = ['milk', 'fruit', 'coffee', 'special', 'milkTea'] as const;
const INGREDIENT_TEMPERATURE_OPTIONS = ['hot', 'cold', 'room'] as const;

type IngredientFormValues = {
  name: string;
  type: Ingredient['type'];
  sweetness: number;
  sourness: number;
  saltiness: number;
  bitterness: number;
  lactose: boolean;
  compatibleWith: Ingredient['compatibleWith'];
  availableTemperatures: Ingredient['availableTemperatures'];
};

type IngredientWithId = Ingredient & {
  id: number;
};

type DbIngredient = {
  id: number;
  name: string;
  ingredient_type: Ingredient['type'];
  lactose: boolean;
  sweetness: number;
  sourness: number;
  bitterness: number;
  saltiness: number;
  compatible_with: Ingredient['compatibleWith'] | null;
  available_temperatures: Ingredient['availableTemperatures'] | null;
};

const mapDbIngredientToUi = (item: DbIngredient): IngredientWithId => {
  return {
    id: item.id,
    name: item.name,
    type: item.ingredient_type,
    lactose: item.lactose,
    sweetness: item.sweetness,
    sourness: item.sourness,
    bitterness: item.bitterness,
    saltiness: item.saltiness,
    compatibleWith: item.compatible_with ?? [],
    availableTemperatures: item.available_temperatures ?? [],
  };
};

const EditableInput = ({
  value,
  onChange,
  tasteKey,
}: {
  value: number;
  onChange: (value: number) => void;
  tasteKey: string;
}) => {
  const iconByKey: Record<string, StaticImageData> = {
    sweetness: SweetnessIcon,
    sourness: SournessIcon,
    bitterness: BitternessIcon,
    saltiness: SaltinessIcon,
  };
  return (
    <div className="flex gap-2 items-center border-r-1 border-neutral-400 pr-2">
      <Image src={iconByKey[tasteKey]} width={40} height={40} alt={tasteKey} />

      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-16 px-2 py-1 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900"
      />
    </div>
  );
};

const IngredientItem = ({
  ingredient,
  onFormValuesChange,
  onRemove,
}: {
  ingredient: IngredientWithId;
  onFormValuesChange: (id: number, values: IngredientFormValues) => Promise<IngredientWithId>;
  onRemove: (id: number) => void;
}) => {
  const [isCompatibilityOpen, setIsCompatibilityOpen] = useState(false);
  const [isTemperatureOpen, setIsTemperatureOpen] = useState(false);
  const [formValues, setFormValues] = useState<IngredientFormValues>({
    name: ingredient.name,
    type: ingredient.type,
    sweetness: ingredient.sweetness,
    sourness: ingredient.sourness,
    saltiness: ingredient.saltiness,
    bitterness: ingredient.bitterness,
    lactose: ingredient.lactose,
    compatibleWith: ingredient.compatibleWith ?? [],
    availableTemperatures: ingredient.availableTemperatures ?? [],
  });
  const [hideFullInfo, setHideFullInfo] = useState(true);

  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      onFormValuesChange(ingredient.id, formValues).catch((error) => {
        console.error('Failed to edit ingredient from form change', error);
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [formValues, ingredient.id, onFormValuesChange]);

  const handleTasteChange = (field: 'sweetness' | 'sourness' | 'saltiness' | 'bitterness', value: number) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: Number(value),
    }));
  };

  const compatibilityKeys = useMemo(() => {
    return INGREDIENT_COMPATIBILITY_OPTIONS;
  }, []);

  const unusedCompatibilities = useMemo(() => {
    return compatibilityKeys.filter((key) => !formValues.compatibleWith?.includes(key));
  }, [compatibilityKeys, formValues.compatibleWith]);

  const temperatureKeys = useMemo(() => {
    return INGREDIENT_TEMPERATURE_OPTIONS;
  }, []);

  const unusedTemperatures = useMemo(() => {
    return temperatureKeys.filter((key) => !formValues.availableTemperatures?.includes(key));
  }, [temperatureKeys, formValues.availableTemperatures]);

  return (
    <div className="flex relative flex-col gap-2 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg shadow">
      <div
        onClick={() => onRemove(ingredient.id)}
        className={
          'absolute z-100 pointer-events-auto right-4 bottom-4 text-red-700 p-2 border-2 rounded-lg border-red-700 cursor-pointer hover:bg-red-700/40'
        }
      >
        <Trash />
      </div>

      <div className="flex justify-start gap-2 items-center justify-between">
        <div className="flex gap-2 items-center shrink">
          <ChevronDown onClick={() => setHideFullInfo((prev) => !prev)} />
        </div>
        <input
          className={'w-4/5 p-2 rounded-lg block bg-zinc-900'}
          value={formValues.name}
          onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))}
        />
      </div>

      {!hideFullInfo && (
        <>
          <div className="flex flex-wrap gap-2 items-center">
            <EditableInput
              value={formValues.sweetness}
              onChange={(value) => handleTasteChange('sweetness', value)}
              tasteKey="sweetness"
            />
            <EditableInput
              value={formValues.sourness}
              onChange={(value) => handleTasteChange('sourness', value)}
              tasteKey="sourness"
            />
            <EditableInput
              value={formValues.saltiness}
              onChange={(value) => handleTasteChange('saltiness', value)}
              tasteKey="saltiness"
            />
            <EditableInput
              value={formValues.bitterness}
              onChange={(value) => handleTasteChange('bitterness', value)}
              tasteKey="bitterness"
            />

            <div className="flex items-center gap-2">
              <label htmlFor={`${ingredient.id}-type`}>Type:</label>
              <select
                id={`${ingredient.id}-type`}
                value={formValues.type}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    type: e.target.value as IngredientType,
                  }))
                }
                className="px-2 py-1 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900"
              >
                {INGREDIENT_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <label htmlFor={`${ingredient.name}-lactose`}>Lactose:</label>
              <select
                id={`${ingredient.name}-lactose`}
                value={formValues.lactose ? 'yes' : 'no'}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    lactose: e.target.value === 'yes',
                  }))
                }
                className="px-2 py-1 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 relative">
            <div>
              Compatible With:
              <div className="inline-flex gap-2">
                {formValues.compatibleWith.map((item) => (
                  <div
                    key={item}
                    className="flex justify-between w-[80px] px-2 py-1 group bg-zinc-200 dark:bg-zinc-700 rounded transform-all"
                  >
                    {item}
                    <div
                      onClick={() => {
                        setFormValues((prev) => ({
                          ...prev,
                          compatibleWith: prev.compatibleWith.filter((i) => i !== item),
                        }));
                      }}
                      className="hidden group-hover:block"
                    >
                      <X />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCompatibilityOpen((prev) => !prev)}
              className="border border-neutral-400 rounded p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              aria-expanded={isCompatibilityOpen}
              aria-label="Toggle compatibility options"
            >
              <Plus size={16} />
            </button>
            <button
              type="button"
              onClick={() => {
                setFormValues((prev) => ({
                  ...prev,
                  compatibleWith: compatibilityKeys as unknown as Ingredient['compatibleWith'],
                }));
              }}
              className="border text-nowrap leading-tight border-neutral-400 rounded px-1 py-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            >
              Select all
            </button>
            {isCompatibilityOpen && (
              <div className="absolute left-0 top-full mt-2 z-20 min-w-[180px] rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg p-2">
                {unusedCompatibilities.length === 0 ? (
                  <div className="px-2 py-1 text-sm text-zinc-500">No more options</div>
                ) : (
                  unusedCompatibilities.map((compatibility) => (
                    <button
                      key={compatibility}
                      type="button"
                      className="w-full text-left cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 p-2 rounded"
                      onClick={() => {
                        setFormValues((prev) => ({
                          ...prev,
                          compatibleWith: [...prev.compatibleWith, compatibility],
                        }));
                        setIsCompatibilityOpen(false);
                      }}
                    >
                      {compatibility}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 relative">
            <div>
              Available Temperatures:
              <div className="inline-flex gap-2">
                {formValues.availableTemperatures.map((item) => (
                  <div
                    key={item}
                    className="flex justify-between w-[80px] px-2 py-1 group bg-zinc-200 dark:bg-zinc-700 rounded transform-all"
                  >
                    {item}
                    <div
                      onClick={() => {
                        setFormValues((prev) => ({
                          ...prev,
                          availableTemperatures: prev.availableTemperatures.filter((i) => i !== item),
                        }));
                      }}
                      className="hidden group-hover:block"
                    >
                      <X />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsTemperatureOpen((prev) => !prev)}
              className="border border-neutral-400 rounded p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              aria-expanded={isTemperatureOpen}
              aria-label="Toggle temperature options"
            >
              <Plus size={16} />
            </button>
            <button
              type="button"
              onClick={() => {
                setFormValues((prev) => ({
                  ...prev,
                  availableTemperatures: temperatureKeys as unknown as Ingredient['availableTemperatures'],
                }));
              }}
              className="border text-nowrap leading-tight border-neutral-400 rounded px-1 py-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            >
              Select all
            </button>
            {isTemperatureOpen && (
              <div className="absolute left-0 top-full mt-2 z-20 min-w-[180px] rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg p-2">
                {unusedTemperatures.length === 0 ? (
                  <div className="px-2 py-1 text-sm text-zinc-500">No more options</div>
                ) : (
                  unusedTemperatures.map((temperature) => (
                    <button
                      key={temperature}
                      type="button"
                      className="w-full text-left cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 p-2 rounded"
                      onClick={() => {
                        setFormValues((prev) => ({
                          ...prev,
                          availableTemperatures: [...prev.availableTemperatures, temperature],
                        }));
                        setIsTemperatureOpen(false);
                      }}
                    >
                      {temperature}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default function Home() {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [ingredients, setIngredients] = useState<IngredientWithId[]>([]);
  const [filters, setFilters] = useState({
    type: 'any' as IngredientType | 'any',
  });
  const handleTopicChange = (newTopic: string) => {
    setTopic(newTopic);
  };

  const filteredIngredients = useMemo(() => {
    if (topic === TOPICS[1]) {
      return [];
    }
    let res = [];
    console.log('FILTERING', ingredients, filters);

    for (const ingredient of ingredients) {
      if (filters.type !== 'any' && ingredient.type !== filters.type) {
        continue;
      }
      res.push(ingredient);
    }

    return res;
  }, [filters, ingredients, topic]);

  const getIngredients = async () => {
    try {
      const response = await fetch('/api/ingredients/getIngredients');
      if (!response.ok) {
        console.error('Failed to fetch ingredients');
      }
      const data = await response.json();
      setIngredients((data as DbIngredient[]).map(mapDbIngredientToUi));
    } catch (error) {
      console.error(error);
    }
  };

  const addIngredient = useCallback(async (values: IngredientFormValues) => {
    const response = await fetch('/api/ingredients/addIngredient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: values.name,
        lactose: values.lactose,
        sweetness: values.sweetness,
        sourness: values.sourness,
        bitterness: values.bitterness,
        saltiness: values.saltiness,
        compatible_with: values.compatibleWith,
        available_temperatures: values.availableTemperatures,
        ingredient_type: values.type,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add ingredient');
    }

    const created = (await response.json()) as DbIngredient;
    return mapDbIngredientToUi(created);
  }, []);

  const editIngredient = useCallback(async (id: number, values: IngredientFormValues) => {
    const response = await fetch('/api/ingredients/editIngredient', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        name: values.name,
        lactose: values.lactose,
        sweetness: values.sweetness,
        sourness: values.sourness,
        bitterness: values.bitterness,
        saltiness: values.saltiness,
        compatible_with: values.compatibleWith,
        available_temperatures: values.availableTemperatures,
        ingredient_type: values.type,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to edit ingredient');
    }

    const updated = (await response.json()) as DbIngredient;
    const mappedUpdated = mapDbIngredientToUi(updated);
    setIngredients((prev) => prev.map((ingredient) => (ingredient.id === id ? mappedUpdated : ingredient)));
    return mappedUpdated;
  }, []);

  const removeIngredient = useCallback(async (id: number) => {
    const response = await fetch('/api/ingredients/removeIngredient', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to remove ingredient');
    }

    const removed = (await response.json()) as DbIngredient;
    setIngredients((prev) => prev.filter((ingredient) => ingredient.id !== id));
    return mapDbIngredientToUi(removed);
  }, []);

  const appendEmptyIngredient = () => {
    const newIngredient: IngredientFormValues = {
      name: 'New Ingredient',
      type: filters?.type !== 'any' ? filters.type : 'base',
      lactose: false,
      sweetness: 0,
      sourness: 0,
      bitterness: 0,
      saltiness: 0,
      compatibleWith: [],
      availableTemperatures: [],
    };
    addIngredient(newIngredient)
      .then((created) => {
        setIngredients((prev) => [...prev, created]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (topic === TOPICS[0]) {
      getIngredients();
    }
  }, [topic]);

  const content = () => {
    switch (topic) {
      case TOPICS[0]:
        return (
          <div className="flex flex-col gap-4">
            {filteredIngredients?.map((ingredient) => (
              <IngredientItem
                key={ingredient.id}
                ingredient={ingredient}
                onFormValuesChange={editIngredient}
                onRemove={() => removeIngredient(ingredient.id)}
              />
            ))}

            <div onClick={appendEmptyIngredient} className={'w-full  p-6 border-2 border-neutral-500'}>
              {' '}
              <Plus />{' '}
            </div>
          </div>
        );
      case TOPICS[1]:
        return <div>Specials Content</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex px-20 w-full min-h-screen flex flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col gap-4 w-[200px] min-h-screen max-w-sm p-8 bg-white dark:bg-zinc-900 shadow border-r-1 border-neutral-600">
        <div className={'cursor-pointer hover:bg-zinc-700 p-4 rounded-lg'} onClick={() => handleTopicChange(TOPICS[0])}>
          Ingredients
        </div>
        <div className={'cursor-pointer hover:bg-zinc-700 p-4 rounded-lg'} onClick={() => handleTopicChange(TOPICS[1])}>
          Specials
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full min-h-screen max-h-screen overflow-scroll p-8 bg-white dark:bg-zinc-900 shadow">
        <h1>{topic}</h1>
        <div className="flex gap-4 items-center">
          <Image src={SweetnessIcon} alt="Sweetness Icon" width={50} height={50} /> - Sweetness
          <Image src={SournessIcon} alt="Sourness Icon" width={50} height={50} /> - Sourness
          <Image src={SaltinessIcon} alt="Saltiness Icon" width={50} height={50} /> - Saltiness
          <Image src={BitternessIcon} alt="Bitterness Icon" width={50} height={50} /> - Bitterness
        </div>

        <div className="flex flex-col w-full p-2 flex-wrap gap-2 bg-zinc-800 rounded-lg ">
          <p>Filters:</p>
          <div className="flex items-center gap-2">
            Type:{' '}
            <select
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  type: e.target.value as IngredientType | 'any',
                }));
              }}
              value={filters.type ?? 'any'}
              className="bg-zinc-900 text-white p-2 rounded"
              name="typeFilter"
              id="typeFilter"
            >
              {INGREDIENT_TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
              <option key="any" value="any">
                any
              </option>
            </select>
          </div>
        </div>

        {content()}
      </div>
    </div>
  );
}
