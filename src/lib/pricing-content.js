export const PRICING_CONTENT_KEY = "pricing-services";

export const ICON_OPTIONS = [
  { value: "leaf", label: "Leaf" },
  { value: "wind", label: "Wind" },
  { value: "scissors", label: "Scissors" },
  { value: "droplets", label: "Droplets" },
  { value: "wrench", label: "Wrench" },
  { value: "car", label: "Car" },
  { value: "sparkles", label: "Sparkles" },
  { value: "home", label: "Home" },
  { value: "lightbulb", label: "Lightbulb" },
];

export const BUTTON_VARIANTS = [
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
];

const createId = (prefix) => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const createService = (service) => ({
  id: service.id || createId("service"),
  icon: service.icon || "sparkles",
  title: service.title || "",
  price: Number.isFinite(Number(service.price)) ? Number(service.price) : 0,
  duration: service.duration || "",
  description: service.description || "",
  buttonText: service.buttonText || "Book Service",
  buttonVariant: service.buttonVariant === "secondary" ? "secondary" : "primary",
});

export const DEFAULT_PRICING_CATEGORIES = [
  {
    id: "yard",
    label: "Yard & Outdoor",
    title: "Yard & Outdoor Jobs",
    subtitle: "Professional outdoor maintenance & cleanup services",
    services: [
      {
        id: "yard-lawn-mowing",
        icon: "leaf",
        title: "Lawn Mowing",
        price: 40,
        duration: "30-60 min",
        description:
          "Lawn mowing with edging and light cleanup to keep your yard neat and healthy.",
        buttonText: "Book Service",
        buttonVariant: "primary",
      },
      {
        id: "yard-weed-removal",
        icon: "wind",
        title: "Weed Removal",
        price: 35,
        duration: "45-90 min",
        description: "Manual weed removal from lawns, garden beds, and walkways.",
        buttonText: "Book Service",
        buttonVariant: "primary",
      },
      {
        id: "yard-leaf-cleanup",
        icon: "wind",
        title: "Leaf Blowing & Cleanup",
        price: 45,
        duration: "1-2 hours",
        description:
          "Leaf blowing and full cleanup from lawns, patios, and driveways.",
        buttonText: "Book Service",
        buttonVariant: "primary",
      },
      {
        id: "yard-general-cleanup",
        icon: "sparkles",
        title: "Yard Cleanup (General)",
        price: 75,
        duration: "2-3 hours",
        description:
          "Complete yard cleanup including debris removal and surface clearing.",
        buttonText: "Book Service",
        buttonVariant: "primary",
      },
      {
        id: "yard-hedge-trimming",
        icon: "scissors",
        title: "Hedge Trimming",
        price: 50,
        duration: "1-2 hours",
        description: "Professional hedge trimming with shaping and debris removal.",
        buttonText: "Book Service",
        buttonVariant: "primary",
      },
      {
        id: "yard-bush-trimming",
        icon: "scissors",
        title: "Bush & Shrub Trimming",
        price: 45,
        duration: "1-2 hours",
        description: "Trimming bushes and shrubs to enhance yard appearance.",
        buttonText: "Book Service",
        buttonVariant: "primary",
      },
      {
        id: "yard-garden-bed-cleanup",
        icon: "leaf",
        title: "Garden Bed Cleanup",
        price: 60,
        duration: "1-2 hours",
        description:
          "Cleaning garden beds, removing weeds, leaves, and debris.",
        buttonText: "Book Service",
        buttonVariant: "primary",
      },
      {
        id: "yard-mulching",
        icon: "droplets",
        title: "Mulching",
        price: 80,
        duration: "2-3 hours",
        description:
          "Mulch installation to protect soil and improve landscape look.",
        buttonText: "Book Service",
        buttonVariant: "primary",
      },
      {
        id: "yard-snow-shoveling",
        icon: "wind",
        title: "Snow Shoveling (Seasonal)",
        price: 35,
        duration: "30-90 min",
        description:
          "Snow removal from driveways and walkways during winter.",
        buttonText: "Book Service",
        buttonVariant: "primary",
      },
      {
        id: "yard-storm-cleanup",
        icon: "sparkles",
        title: "Storm Debris Cleanup",
        price: 90,
        duration: "2-4 hours",
        description: "Post-storm debris and fallen branch cleanup.",
        buttonText: "Book Service",
        buttonVariant: "primary",
      },
    ],
  },
  {
    id: "pet",
    label: "Pet & Property",
    title: "Pet & Property Cleanup",
    subtitle: "Clean, safe & hygienic outdoor environments",
    services: [
      {
        id: "pet-waste-removal",
        icon: "home",
        title: "Dog Poop / Pet Waste Removal",
        price: 25,
        duration: "20-45 min",
        description: "Removal of pet waste from yards to maintain hygiene.",
        buttonText: "Book Now",
        buttonVariant: "primary",
      },
      {
        id: "pet-yard-sanitizing",
        icon: "droplets",
        title: "Yard Sanitizing (Pet Areas)",
        price: 40,
        duration: "45-60 min",
        description: "Sanitizing pet areas to eliminate odor and bacteria.",
        buttonText: "Book Now",
        buttonVariant: "primary",
      },
      {
        id: "pet-litter-cleanup",
        icon: "sparkles",
        title: "Litter Cleanup (Outdoor)",
        price: 30,
        duration: "30-60 min",
        description: "Removal of trash and litter from outdoor areas.",
        buttonText: "Book Now",
        buttonVariant: "primary",
      },
    ],
  },
  {
    id: "vehicle",
    label: "Vehicle Services",
    title: "Vehicle Convenience Services",
    subtitle: "On-demand vehicle care at your location",
    services: [
      {
        id: "vehicle-gas-filling",
        icon: "car",
        title: "Gas Filling (On-Site)",
        price: 15,
        duration: "15-20 min",
        description: "Fuel delivery service (fuel cost not included).",
        buttonText: "Request Service",
        buttonVariant: "primary",
      },
      {
        id: "vehicle-washer-fluid",
        icon: "droplets",
        title: "Windshield Washer Fluid Refill",
        price: 15,
        duration: "10-15 min",
        description:
          "Refill of windshield washer fluid for better visibility.",
        buttonText: "Book Now",
        buttonVariant: "primary",
      },
      {
        id: "vehicle-tire-air",
        icon: "wrench",
        title: "Tire Air Fill",
        price: 15,
        duration: "10-20 min",
        description: "Proper tire pressure check and air fill.",
        buttonText: "Book Now",
        buttonVariant: "primary",
      },
      {
        id: "vehicle-exterior-wash",
        icon: "car",
        title: "Car Exterior Wash",
        price: 30,
        duration: "30-45 min",
        description: "Exterior driveway car wash service.",
        buttonText: "Book Now",
        buttonVariant: "primary",
      },
      {
        id: "vehicle-interior-vacuuming",
        icon: "sparkles",
        title: "Interior Vacuuming",
        price: 25,
        duration: "20-40 min",
        description: "Interior vacuuming of seats, floors, and mats.",
        buttonText: "Book Now",
        buttonVariant: "primary",
      },
    ],
  },
  {
    id: "home",
    label: "Home Exterior",
    title: "Home Exterior Tasks",
    subtitle: "Maintain and refresh your home exterior",
    services: [
      {
        id: "home-trash-bin-cleaning",
        icon: "sparkles",
        title: "Trash Bin Cleaning & Disinfecting",
        price: 25,
        duration: "20-30 min",
        description: "Deep cleaning and disinfecting of trash bins.",
        buttonText: "Book Service",
        buttonVariant: "primary",
      },
      {
        id: "home-pressure-washing",
        icon: "droplets",
        title: "Pressure Washing",
        price: 80,
        duration: "1-2 hours",
        description:
          "Pressure washing for driveways, sidewalks, and patios.",
        buttonText: "Book Service",
        buttonVariant: "primary",
      },
      {
        id: "home-gutter-removal",
        icon: "wind",
        title: "Gutter Debris Removal",
        price: 60,
        duration: "1-2 hours",
        description:
          "Ground-level gutter debris removal for smooth drainage.",
        buttonText: "Book Service",
        buttonVariant: "primary",
      },
      {
        id: "home-window-washing",
        icon: "sparkles",
        title: "Window Washing (Ground-Level)",
        price: 40,
        duration: "1-2 hours",
        description:
          "Exterior window washing for ground-level windows.",
        buttonText: "Book Service",
        buttonVariant: "primary",
      },
      {
        id: "home-patio-sweeping",
        icon: "home",
        title: "Patio & Deck Sweeping",
        price: 35,
        duration: "30-60 min",
        description:
          "Sweeping patios and decks for a clean outdoor space.",
        buttonText: "Book Service",
        buttonVariant: "primary",
      },
    ],
  },
];

const cloneCategory = (category) => ({
  ...category,
  services: category.services.map(createService),
});

export const clonePricingCategories = () =>
  DEFAULT_PRICING_CATEGORIES.map(cloneCategory);

export const normalizePricingCategories = (inputCategories) => {
  if (!Array.isArray(inputCategories) || inputCategories.length === 0) {
    return clonePricingCategories();
  }

  return DEFAULT_PRICING_CATEGORIES.map((defaultCategory, index) => {
    const sourceCategory =
      inputCategories.find((category) => category?.id === defaultCategory.id) ||
      inputCategories[index];

    if (!sourceCategory) {
      return cloneCategory(defaultCategory);
    }

    return {
      id: defaultCategory.id,
      label: sourceCategory.label || defaultCategory.label,
      title: sourceCategory.title || defaultCategory.title,
      subtitle: sourceCategory.subtitle || defaultCategory.subtitle,
      services: Array.isArray(sourceCategory.services)
        ? sourceCategory.services.map(createService)
        : defaultCategory.services.map(createService),
    };
  });
};

export const createEmptyService = () =>
  createService({
    title: "",
    price: 0,
    duration: "",
    description: "",
    icon: "sparkles",
    buttonText: "Book Service",
    buttonVariant: "primary",
  });
