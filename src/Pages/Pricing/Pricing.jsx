import React, { useEffect, useState } from "react";
import { Eye, Pencil, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminApi } from "../../lib/api/admin-api";
import { getApiErrorMessage } from "../../lib/api/http";
import {
  BUTTON_VARIANTS,
  ICON_OPTIONS,
  PRICING_CONTENT_KEY,
  clonePricingCategories,
  createEmptyService,
  normalizePricingCategories,
} from "../../lib/pricing-content";

const formatTimestamp = (value) => {
  if (!value) {
    return "Not saved yet";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not saved yet";
  }

  return date.toLocaleString();
};

const formatPrice = (value) => `$${Number(value || 0).toFixed(2)}`;

const createDraftService = () => createEmptyService();

const validateService = (service) => {
  if (!service.title.trim()) {
    return "Service title is required.";
  }

  if (!service.duration.trim()) {
    return "Duration is required.";
  }

  if (!service.buttonText.trim()) {
    return "Button text is required.";
  }

  if (!service.description.trim()) {
    return "Description is required.";
  }

  return "";
};

const ServiceFields = ({ service, onChange }) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div className="md:col-span-2">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Service Title
      </label>
      <input
        type="text"
        value={service.title}
        onChange={(event) => onChange("title", event.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-700"
      />
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">Price</label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={service.price}
        onChange={(event) => onChange("price", Number(event.target.value || 0))}
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-700"
      />
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">Duration</label>
      <input
        type="text"
        value={service.duration}
        onChange={(event) => onChange("duration", event.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-700"
      />
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">Icon</label>
      <select
        value={service.icon}
        onChange={(event) => onChange("icon", event.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-700"
      >
        {ICON_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Button Variant
      </label>
      <select
        value={service.buttonVariant}
        onChange={(event) => onChange("buttonVariant", event.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-700"
      >
        {BUTTON_VARIANTS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>

    <div className="md:col-span-2">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Button Text
      </label>
      <input
        type="text"
        value={service.buttonText}
        onChange={(event) => onChange("buttonText", event.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-700"
      />
    </div>

    <div className="md:col-span-2">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Description
      </label>
      <textarea
        rows={5}
        value={service.description}
        onChange={(event) => onChange("description", event.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-700"
      />
    </div>
  </div>
);

const Pricing = () => {
  const [categories, setCategories] = useState(() => clonePricingCategories());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [draftService, setDraftService] = useState(() => createDraftService());
  const [editDraftService, setEditDraftService] = useState(() => createDraftService());

  useEffect(() => {
    let ignore = false;

    const loadPricingContent = async () => {
      setIsLoading(true);
      setError("");

      try {
        const content = await adminApi.getContentByKey(PRICING_CONTENT_KEY);

        if (!ignore) {
          setCategories(normalizePricingCategories(content?.value?.categories));
          setLastSavedAt(content?.updatedAt || "");
        }
      } catch (apiError) {
        if (ignore) {
          return;
        }

        if (apiError?.response?.status === 404) {
          setCategories(clonePricingCategories());
          setLastSavedAt("");
          return;
        }

        const nextError = getApiErrorMessage(apiError);
        setError(nextError);
        toast.error(nextError);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadPricingContent();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!categories.length) {
      setActiveCategoryId("");
      setSelectedServiceId("");
      return;
    }

    const activeCategoryStillExists = categories.some(
      (category) => category.id === activeCategoryId
    );
    const nextActiveCategoryId = activeCategoryStillExists
      ? activeCategoryId
      : categories[0].id;

    if (nextActiveCategoryId !== activeCategoryId) {
      setActiveCategoryId(nextActiveCategoryId);
      return;
    }

    const activeCategory = categories.find(
      (category) => category.id === nextActiveCategoryId
    );
    const selectedServiceStillExists = activeCategory?.services.some(
      (service) => service.id === selectedServiceId
    );

    if (!selectedServiceStillExists) {
      setSelectedServiceId(activeCategory?.services[0]?.id || "");
    }
  }, [activeCategoryId, categories, selectedServiceId]);

  const totalServices = categories.reduce(
    (total, category) => total + category.services.length,
    0
  );

  const activeCategory =
    categories.find((category) => category.id === activeCategoryId) || categories[0] || null;

  const selectedService =
    categories
      .flatMap((category) => category.services)
      .find((service) => service.id === selectedServiceId) || null;

  const updateCategoryField = (categoryId, field, value) => {
    setCategories((current) =>
      current.map((category) =>
        category.id === categoryId ? { ...category, [field]: value } : category
      )
    );
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategoryId(categoryId);
    const category = categories.find((item) => item.id === categoryId);
    setSelectedServiceId(category?.services[0]?.id || "");
  };

  const updateDraftServiceField = (field, value) => {
    setDraftService((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateEditDraftServiceField = (field, value) => {
    setEditDraftService((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const openViewDialog = (categoryId, service) => {
    setActiveCategoryId(categoryId);
    setSelectedServiceId(service.id);
    setIsViewDialogOpen(true);
  };

  const openEditDialog = (categoryId, service) => {
    setActiveCategoryId(categoryId);
    setSelectedServiceId(service.id);
    setEditDraftService({ ...service });
    setIsEditDialogOpen(true);
  };

  const openAddDialog = (categoryId) => {
    setActiveCategoryId(categoryId);
    setDraftService(createDraftService());
    setIsAddDialogOpen(true);
  };

  const handleCreateService = () => {
    if (!activeCategory) {
      toast.error("No pricing section is selected.");
      return;
    }

    const validationError = validateService(draftService);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const nextService = {
      ...draftService,
      title: draftService.title.trim(),
      duration: draftService.duration.trim(),
      buttonText: draftService.buttonText.trim(),
      description: draftService.description.trim(),
      price: Number(draftService.price || 0),
    };

    setCategories((current) =>
      current.map((category) =>
        category.id !== activeCategory.id
          ? category
          : {
              ...category,
              services: [...category.services, nextService],
            }
      )
    );

    setSelectedServiceId(nextService.id);
    setDraftService(createDraftService());
    setIsAddDialogOpen(false);
    toast.success(`Added "${nextService.title}" to ${activeCategory.label}.`);
  };

  const handleUpdateService = () => {
    if (!activeCategory) {
      toast.error("No pricing section is selected.");
      return;
    }

    const validationError = validateService(editDraftService);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const nextService = {
      ...editDraftService,
      title: editDraftService.title.trim(),
      duration: editDraftService.duration.trim(),
      buttonText: editDraftService.buttonText.trim(),
      description: editDraftService.description.trim(),
      price: Number(editDraftService.price || 0),
    };

    setCategories((current) =>
      current.map((category) =>
        category.id !== activeCategory.id
          ? category
          : {
              ...category,
              services: category.services.map((service) =>
                service.id === nextService.id ? nextService : service
              ),
            }
      )
    );

    setSelectedServiceId(nextService.id);
    setIsEditDialogOpen(false);
    toast.success(`Updated "${nextService.title}".`);
  };

  const handleRemoveService = (categoryId, serviceId) => {
    const category = categories.find((item) => item.id === categoryId);
    const removedService = category?.services.find((service) => service.id === serviceId);
    const remainingServices =
      category?.services.filter((service) => service.id !== serviceId) || [];

    setCategories((current) =>
      current.map((item) =>
        item.id !== categoryId
          ? item
          : {
              ...item,
              services: item.services.filter((service) => service.id !== serviceId),
            }
      )
    );

    if (activeCategoryId === categoryId && selectedServiceId === serviceId) {
      setSelectedServiceId(remainingServices[0]?.id || "");
    }

    toast.success(
      removedService?.title
        ? `Deleted "${removedService.title}".`
        : "Service deleted successfully."
    );
  };

  const handleReset = () => {
    const nextCategories = clonePricingCategories();
    setCategories(nextCategories);
    setActiveCategoryId(nextCategories[0]?.id || "");
    setSelectedServiceId(nextCategories[0]?.services[0]?.id || "");
    setError("");
    toast.info("Pricing services restored to the default list.");
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");

    try {
      const content = await adminApi.upsertContent(PRICING_CONTENT_KEY, {
        title: "Pricing Services",
        isPublic: true,
        value: {
          categories,
        },
      });

      setCategories(normalizePricingCategories(content?.value?.categories));
      setLastSavedAt(content?.updatedAt || new Date().toISOString());
      toast.success("Pricing content saved successfully.");
    } catch (apiError) {
      const nextError = getApiErrorMessage(apiError);
      setError(nextError);
      toast.error(nextError);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f7f4] p-6 pt-24">
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">
          Loading pricing content...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7f4] p-6 pt-24">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 border border-gray-200 bg-white p-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-green-800">
              Pricing Management
            </p>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                Manage services by section
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-600">
                Each section now has its own tab. Select a section to browse all of its
                services in one table, then open a dialog to view or edit service
                details.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4" />
              Restore Defaults
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-800 bg-green-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="border border-gray-200 bg-white p-5">
            <div className="text-sm text-gray-500">Total Services</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">{totalServices}</div>
          </div>
          <div className="border border-gray-200 bg-white p-5">
            <div className="text-sm text-gray-500">Total Sections</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">{categories.length}</div>
          </div>
          <div className="border border-gray-200 bg-white p-5">
            <div className="text-sm text-gray-500">Last Synced</div>
            <div className="mt-2 text-lg font-semibold text-gray-900">
              {formatTimestamp(lastSavedAt)}
            </div>
          </div>
        </div>

        {error ? (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {activeCategory ? (
          <Tabs value={activeCategory.id} onValueChange={handleCategoryChange}>
            <TabsList className="justify-start overflow-x-auto">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="min-w-max"
                >
                  {category.label}
                  <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs text-current">
                    {category.services.length}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => {
              const isActiveCategory = category.id === activeCategory.id;
              const currentSelectedService = isActiveCategory
                ? selectedService
                : category.services[0] || null;
              return (
                <TabsContent key={category.id} value={category.id}>
                  <div className="space-y-6">
                    <section className="border border-gray-200 bg-white">
                      <div className="border-b border-gray-200 px-6 py-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Section Details
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                          Edit the label, title, and subtitle for this pricing section.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-3">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Tab Label
                          </label>
                          <input
                            type="text"
                            value={category.label}
                            onChange={(event) =>
                              updateCategoryField(category.id, "label", event.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-700"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Section Title
                          </label>
                          <input
                            type="text"
                            value={category.title}
                            onChange={(event) =>
                              updateCategoryField(category.id, "title", event.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-700"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Section Subtitle
                          </label>
                          <input
                            type="text"
                            value={category.subtitle}
                            onChange={(event) =>
                              updateCategoryField(category.id, "subtitle", event.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-700"
                          />
                        </div>
                      </div>
                    </section>

                    <section className="border border-gray-200 bg-white">
                      <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">
                            Services in {category.label}
                          </h2>
                          <p className="mt-1 text-sm text-gray-500">
                            View all services in this section, then use the actions to open
                            the view or edit dialog.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => openAddDialog(category.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-800 bg-green-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-800"
                        >
                          <Plus className="h-4 w-4" />
                          Add Service
                        </button>
                      </div>

                      {category.services.length === 0 ? (
                        <div className="px-6 py-10 text-center text-sm text-gray-500">
                          No services in this section yet.
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="min-w-full border-collapse text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase tracking-[0.16em] text-gray-500">
                              <tr>
                                <th className="border-b border-gray-200 px-4 py-3 font-medium">
                                  Service
                                </th>
                                <th className="border-b border-gray-200 px-4 py-3 font-medium">
                                  Price
                                </th>
                                <th className="border-b border-gray-200 px-4 py-3 font-medium">
                                  Duration
                                </th>
                                <th className="border-b border-gray-200 px-4 py-3 font-medium">
                                  Icon
                                </th>
                                <th className="border-b border-gray-200 px-4 py-3 font-medium">
                                  Button Text
                                </th>
                                <th className="border-b border-gray-200 px-4 py-3 font-medium">
                                  Variant
                                </th>
                                <th className="border-b border-gray-200 px-4 py-3 font-medium text-right">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {category.services.map((service) => {
                                const isSelected = service.id === currentSelectedService?.id;

                                return (
                                  <tr
                                    key={service.id}
                                    className={
                                      isSelected ? "bg-green-50" : "bg-white hover:bg-gray-50"
                                    }
                                  >
                                    <td className="border-b border-gray-200 px-4 py-3">
                                      <div className="font-medium text-gray-900">
                                        {service.title || "Untitled service"}
                                      </div>
                                      <div className="mt-1 text-xs text-gray-500">
                                        {service.description || "No description yet."}
                                      </div>
                                    </td>
                                    <td className="border-b border-gray-200 px-4 py-3 text-gray-700">
                                      {formatPrice(service.price)}
                                    </td>
                                    <td className="border-b border-gray-200 px-4 py-3 text-gray-700">
                                      {service.duration || "Not set"}
                                    </td>
                                    <td className="border-b border-gray-200 px-4 py-3 text-gray-700">
                                      {
                                        ICON_OPTIONS.find((option) => option.value === service.icon)
                                          ?.label
                                      }
                                    </td>
                                    <td className="border-b border-gray-200 px-4 py-3 text-gray-700">
                                      {service.buttonText || "Not set"}
                                    </td>
                                    <td className="border-b border-gray-200 px-4 py-3 text-gray-700">
                                      {
                                        BUTTON_VARIANTS.find(
                                          (option) => option.value === service.buttonVariant
                                        )?.label
                                      }
                                    </td>
                                    <td className="border-b border-gray-200 px-4 py-3">
                                      <div className="flex justify-end gap-2">
                                        <button
                                          type="button"
                                          onClick={() => openViewDialog(category.id, service)}
                                          className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-white"
                                        >
                                          <Eye className="h-3.5 w-3.5" />
                                          View
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => openEditDialog(category.id, service)}
                                          className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-white"
                                        >
                                          <Pencil className="h-3.5 w-3.5" />
                                          Edit
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRemoveService(category.id, service.id)
                                          }
                                          className="inline-flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                          Delete
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </section>

                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        ) : null}

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add Service</DialogTitle>
              <DialogDescription>
                Enter the required details to create a new service in{" "}
                <span className="font-medium text-gray-700">
                  {activeCategory?.label || "this section"}
                </span>
                .
              </DialogDescription>
            </DialogHeader>

            <ServiceFields service={draftService} onChange={updateDraftServiceField} />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleCreateService}>
                Create Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>View Service</DialogTitle>
              <DialogDescription>
                Review the selected service details.
              </DialogDescription>
            </DialogHeader>

            {selectedService ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.16em] text-gray-500">
                    Service Title
                  </div>
                  <div className="mt-1 text-base font-medium text-gray-900">
                    {selectedService.title || "Untitled service"}
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.16em] text-gray-500">
                    Price
                  </div>
                  <div className="mt-1 text-sm text-gray-900">
                    {formatPrice(selectedService.price)}
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.16em] text-gray-500">
                    Duration
                  </div>
                  <div className="mt-1 text-sm text-gray-900">
                    {selectedService.duration || "Not set"}
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.16em] text-gray-500">
                    Icon
                  </div>
                  <div className="mt-1 text-sm text-gray-900">
                    {ICON_OPTIONS.find((option) => option.value === selectedService.icon)
                      ?.label || "Not set"}
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.16em] text-gray-500">
                    Button Variant
                  </div>
                  <div className="mt-1 text-sm text-gray-900">
                    {BUTTON_VARIANTS.find(
                      (option) => option.value === selectedService.buttonVariant
                    )?.label || "Not set"}
                  </div>
                </div>

                <div className="md:col-span-2 rounded-lg border border-gray-200 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.16em] text-gray-500">
                    Button Text
                  </div>
                  <div className="mt-1 text-sm text-gray-900">
                    {selectedService.buttonText || "Not set"}
                  </div>
                </div>

                <div className="md:col-span-2 rounded-lg border border-gray-200 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.16em] text-gray-500">
                    Description
                  </div>
                  <div className="mt-1 text-sm leading-6 text-gray-900">
                    {selectedService.description || "No description yet."}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No service selected.</div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsViewDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Service</DialogTitle>
              <DialogDescription>
                Update the selected service and save the changes.
              </DialogDescription>
            </DialogHeader>

            <ServiceFields
              service={editDraftService}
              onChange={updateEditDraftServiceField}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleUpdateService}>
                Update Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Pricing;
