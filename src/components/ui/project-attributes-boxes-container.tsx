import { Card } from "@nextui-org/react";

// Define the TypeScript interface for the attributes
interface ProjectAttribute {
  supply?: number | string;
  min?: number | string;
  total?: number | string;
  APY?: number | string;
  tokens?: number | string;
  valor?: number | string;
}

interface ProjectAttributesContainerProps {
  items: ProjectAttribute; // The list of attributes to render
  layout?: "horizontal" | "vertical"; // Layout type: horizontal or vertical
  size?: "lg" | "xl"; // Card size: lg for small, xl for big
  isTranslucent?: boolean;
  isGrid?: boolean; // Prop to determine if the layout should be in grid format
  ignoreTheme?: boolean;
}

export const ProjectAttributeBox = ({
  name,
  value,
  size = "lg",
  isTranslucent = false,
  ignoreTheme = false,
}: {
  name: string;
  value: number | string;
  size?: "lg" | "xl";
  isTranslucent?: boolean;
  ignoreTheme?: boolean;
}) => {
  return (
    <Card
      className={`border-none flex items-center justify-center ${
        isTranslucent ? "bg-white/20 dark:bg-dark" : "bg-white"
      } ${
        size === "xl" ? "w-32 h-24" : "w-20 h-12"
      } rounded-md shadow-project-attribute-box-custom`}
    >
      <div
        className={`flex flex-col items-center justify-center font-sen text-primary ${
          !ignoreTheme && "dark:text-white"
        }`}
      >
        <p
          className={`font-bold text-center ${
            size === "xl" ? "text-xl" : "text-sm"
          }`}
        >
          {value}
        </p>
        <h2
          className={`font-normal self-center text-center ${
            size === "xl" ? "text-lg" : "text-[13px] lg:text-sm"
          }`}
        >
          {name}
        </h2>
      </div>
    </Card>
  );
};

// Container component to map over attributes and render ProjectAttributeBox for each
const ProjectAttributesContainer = ({
  items,
  layout = "vertical", // Default layout is vertical
  size = "lg", // Default size is lg
  isTranslucent = false,
  isGrid = false, // Default is false, meaning no grid layout unless specified
  ignoreTheme = false,
}: ProjectAttributesContainerProps) => {
  // Create an array of the attributes and their values to map over
  const attributes = Object.entries(items).filter(
    ([_, value]) => value !== undefined
  );

  return (
    <div
      className={`${
        isGrid
          ? "grid grid-cols-2 gap-4" // Use grid layout when isGrid is true
          : layout === "horizontal"
          ? "flex flex-row gap-4"
          : "flex flex-col gap-4"
      } w-full items-center justify-between`}
    >
      {attributes.map(([name, value], index) => (
        <ProjectAttributeBox
          key={index}
          name={name}
          value={value as number | string}
          size={size} // Apply the size prop (lg or xl) to all boxes
          isTranslucent={isTranslucent}
          ignoreTheme={ignoreTheme}
        />
      ))}
    </div>
  );
};

export default ProjectAttributesContainer;
