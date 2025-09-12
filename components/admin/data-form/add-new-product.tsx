import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Formik, Form, Field } from "formik";
import { Input } from "@/components/ui/input";
import { ImagePlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { MultiSelect } from "@/components/ui/multi-select";
import { getAllTagsData } from "@/actions/tags/get-all-tags";
import { toast } from "sonner";
import { getAllCategoriesData } from "@/actions/categories/get-all-categories";
import { Textarea } from "@/components/ui/textarea";
import { addNewProductAction } from "@/actions/admin/products/add-new-product";
import getUserSession from "@/actions/auth/regisreation/get-user-session";

export function AddNewProductForm({
  validationSchema,
}: {
  validationSchema: any;
}) {
  const [tagsOptions, setTagsOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoriesOptions, setCategoriesOptions] = useState<
    {
      label: string;
      value: string;
      icon: string;
      color: string;
      slug: string;
    }[]
  >([]);
  const [selectedVariant, setSelectedVariant] = useState<string>(
    Object.keys({})[0] || ""
  );
  const [addedVariant, setAddedVariant] = useState<string>("");
  const [addedVariantOptions, setAddedVariantOptions] = useState<
    { id: string; price: number; label: string }[]
  >([{ id: "t-1", price: 0, label: "Type 1" }]);

  async function loadingResources() {
    try {
      const { tagsData } = await getAllTagsData();
      const { categoriesData } = await getAllCategoriesData();

      setTagsOptions(() => {
        if (tagsData?.length === 0) return [];
        return tagsData!.map((tag) => ({ label: tag.name, value: tag.id }));
      });

      setCategoriesOptions(() => {
        if (categoriesData?.length === 0) return [];
        return categoriesData!.map((cate) => ({
          label: cate.name,
          value: cate.id,
          icon: cate.icon || "",
          color: cate.color || "#000",
          slug: cate.slug,
        }));
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Tags or Categories:", error);
      toast.error("Failed to fetch tags or categories data.");
    }
  }
  useEffect(() => {
    loadingResources();
  }, []);

  function updateVariantOption(
    setFieldValue: Function,
    values: any,
    variantName: string,
    optionId: string,
    field: string,
    value: string | number
  ): void {
    const variants = values.variants as Record<
      string,
      Array<{ id: string; label: string; price: number }>
    >;
    setFieldValue("variants", {
      ...variants,
      [variantName]: variants[variantName].map((option) =>
        option.id === optionId ? { ...option, [field]: value } : option
      ),
    });
  }

  if (loading) return <>Loading...</>;

  return (
    <Formik
      initialValues={{
        name: "",
        description: "",
        price: "",
        stock: "0",
        category: "no-cate",
        tags: [],
        images: [],
        variants: {},
      }}
      //   validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);

        try {
          const AdminId = (await getUserSession()).userData?.id;

          if (!AdminId) {
            toast.error("Failed to add product.");
            return;
          }

          const { data, error, success } = await addNewProductAction({
            ...values,
            price: Number(values.price),
            stock: Number(values.stock),
            seller: AdminId!,
            images: [
              "014b63c0-9c20-4dd5-bd4d-c8a4bebfc4b4",
              "058d00b5-9a44-45c0-9b14-21a712f4b613",
              "0ec3c90a-5eb9-480d-885c-608e9d6915c5",
            ],
            variants: JSON.stringify(values.variants),
          });

          if (success) {
            toast.success(
              `Product ${(await data)?.name} created successfully.`
            );
          } else {
            toast.error(error || "Failed to add product.");
          }
        } catch (err) {
          console.log(err);
        }

        setSubmitting(false);
      }}
      enableReinitialize={true}
    >
      {({ values, setFieldValue, errors, touched, isSubmitting }) => (
        <Form className="grid grid-cols-2 w-full space-x-2 space-y-2">
          {/* Product Basic Information */}
          <div>
            <Label htmlFor="name" className="text-right mb-2">
              Name
            </Label>
            <Field name="name">
              {({ field }: any) => (
                <Textarea {...field} id="name" className="w-full" />
              )}
            </Field>
            {touched.name && errors.name && (
              <div className="text-destructive text-sm mt-1">{errors.name}</div>
            )}
          </div>

          <div>
            <Label htmlFor="description" className="text-right mb-2">
              Description
            </Label>
            <Field name="description">
              {({ field }: any) => (
                <Textarea {...field} id="description" className="w-full" />
              )}
            </Field>
            {touched.description && errors.description && (
              <div className="text-destructive text-sm mt-1">
                {errors.description}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="col-span-1 space-x-3 space-y-3">
            <div>
              <Label htmlFor="price" className="text-right mb-2">
                Price
              </Label>
              <Field name="price">
                {({ field }: any) => (
                  <Input
                    {...field}
                    id="price"
                    type="number"
                    className="w-full"
                  />
                )}
              </Field>
              {touched.price && errors.price && (
                <div className="text-destructive text-sm mt-1">
                  {errors.price}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="stock" className="text-right mb-2">
                Stock
              </Label>
              <Field name="stock">
                {({ field }: any) => (
                  <Input
                    {...field}
                    id="stock"
                    type="number"
                    className="w-full"
                  />
                )}
              </Field>
              {touched.stock && errors.stock && (
                <div className="text-destructive text-sm mt-1">
                  {errors.stock}
                </div>
              )}
            </div>

            <div className="flex flex-col sp items-start space-y-6 mb-10">
              <Label htmlFor="tags" className="text-right pt-2">
                Tags
              </Label>
              <MultiSelect
                defaultValue={values.tags}
                options={tagsOptions}
                onValueChange={(value) => {
                  setFieldValue("tags", value);
                }}
                placeholder="Select Product Tags"
                variant="inverted"
                animation={0.5}
                maxCount={3}
              />
            </div>
          </div>

          {/* Product Media and Category */}
          <div className="col-span-1">
            <div>
              <div className="flex flex-col items-start space-y-6">
                <Label htmlFor="images" className="text-right pt-2">
                  Images
                </Label>
                <div className="col-span-3">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {values.images?.map((image: any, index: number) => (
                      <div key={index} className="relative group aspect-square">
                        <img
                          src={image.url}
                          alt={image.alt || `Image ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border-2 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = values.images.filter(
                              (_: any, i: number) => i !== index
                            );
                            setFieldValue("images", newImages);
                          }}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground 
                                                     rounded-full p-1 w-6 h-6 opacity-0 group-hover:opacity-100 
                                                     transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <label
                      className="border-2 border-dashed border-muted hover:border-primary 
                                                rounded-lg aspect-square flex flex-col items-center 
                                                justify-center cursor-pointer transition-all hover:bg-accent"
                    >
                      <div className="w-full h-full flex justify-around items-center">
                        <ImagePlus className="h-6 w-6 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          Add Image
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFieldValue("images", [
                                ...(values.images || []),
                                { url: reader.result, alt: file.name },
                              ]);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
                {/* {touched.images && errors.images && (
                  <div className="text-destructive text-sm mt-2">
                    {errors.images}
                  </div>
                )} */}
              </div>
            </div>

            <div className="flex flex-col items-start space-y-6">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={values.category}
                defaultValue="no-cate"
                onValueChange={(value) => setFieldValue("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem disabled className="my-3" value={"no-cate"}>
                    No Category
                  </SelectItem>
                  {categoriesOptions.map((cate) => (
                    <SelectItem
                      key={cate.value}
                      className="my-3"
                      style={{ background: cate.color }}
                      value={cate.value}
                    >
                      {cate.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {touched.category && errors.category && (
                <div className="text-destructive text-sm mt-1">
                  {errors.category}
                </div>
              )}
            </div>
          </div>

          {/* Product Variants */}
          <div className="col-span-2">
            <div className="mb-4">
              <Label htmlFor="variants" className="text-right mb-2">
                Add new variant
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="variants"
                  className="w-full"
                  placeholder="e.g. size, color"
                  value={addedVariant}
                  onChange={(e) => setAddedVariant(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={() => {
                    setFieldValue("variants", {
                      ...values.variants,
                      [addedVariant]: addedVariantOptions,
                    });
                    setAddedVariant(addedVariant);
                  }}
                  variant={"secondary"}
                >
                  Add
                </Button>
              </div>
            </div>
            <div>
              <Select
                value={selectedVariant}
                onValueChange={setSelectedVariant}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a variant to edit" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(values.variants).map((varName) => {
                    console.log(varName);
                    return (
                      <SelectItem
                        key={varName}
                        className="my-3"
                        value={varName}
                      >
                        {varName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-2 h-40 overflow-y-auto border p-2 rounded-md">
              {selectedVariant &&
                values.variants &&
                (values.variants as Record<string, any>)[selectedVariant] && (
                  <div className="space-y-2">
                    {(
                      values.variants as Record<
                        string,
                        Array<{
                          id: string;
                          label: string;
                          about: string;
                          price: number;
                        }>
                      >
                    )[selectedVariant].map((option: any, index: number) => (
                      <div
                        key={option.id}
                        className="flex flex-col items-stretch gap-2 p-2 border rounded-md"
                      >
                        <div className="flex-1">
                          <Label
                            htmlFor={`${selectedVariant}-${option.id}-label`}
                            className="text-sm"
                          >
                            Label
                          </Label>
                          <Input
                            id={`${selectedVariant}-${option.id}-label`}
                            value={option.label}
                            onChange={(e) =>
                              updateVariantOption(
                                setFieldValue,
                                values,
                                selectedVariant,
                                option.id,
                                "label",
                                e.target.value
                              )
                            }
                            className="w-full"
                            placeholder="Option label"
                          />
                        </div>

                        <div className="flex-1">
                          <Label
                            htmlFor={`${selectedVariant}-${option.id}-about`}
                            className="text-sm"
                          >
                            About
                          </Label>
                          <Input
                            id={`${selectedVariant}-${option.id}-about`}
                            value={option.about}
                            onChange={(e) =>
                              updateVariantOption(
                                setFieldValue,
                                values,
                                selectedVariant,
                                option.id,
                                "about",
                                e.target.value
                              )
                            }
                            className="w-full"
                            placeholder="Option label"
                          />
                        </div>

                        <div className="flex-1">
                          <Label
                            htmlFor={`${selectedVariant}-${option.id}-price`}
                            className="text-sm"
                          >
                            Price
                          </Label>
                          <Input
                            id={`${selectedVariant}-${option.id}-price`}
                            type="number"
                            defaultValue={values.price}
                            value={option.price}
                            onChange={(e) =>
                              updateVariantOption(
                                setFieldValue,
                                values,
                                selectedVariant,
                                option.id,
                                "price",
                                Number(e.target.value)
                              )
                            }
                            className="w-full"
                            placeholder="Price"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            const variants = values.variants as Record<
                              string,
                              Array<{
                                id: string;
                                label: string;
                                price: number;
                              }>
                            >;
                            setFieldValue("variants", {
                              ...variants,
                              [selectedVariant]: variants[
                                selectedVariant
                              ].filter((opt) => opt.id !== option.id),
                            });
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const variants = values.variants as Record<
                          string,
                          Array<{ id: string; label: string; price: number }>
                        >;
                        const newOption = {
                          id: `opt-${Date.now()}`,
                          label: "New Option",
                          price: 0,
                        };
                        setFieldValue("variants", {
                          ...variants,
                          [selectedVariant]: [
                            ...variants[selectedVariant],
                            newOption,
                          ],
                        });
                      }}
                    >
                      + Add Option
                    </Button>
                  </div>
                )}
            </div>
          </div>

          <DialogFooter className="col-span-2 w-full mt-5">
            <Button className="mx-auto" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </Form>
      )}
    </Formik>
  );
}
