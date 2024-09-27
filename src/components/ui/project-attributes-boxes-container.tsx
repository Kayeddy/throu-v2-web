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
}

const ProjectAttributeBox = ({
  name,
  value,
  size = "lg",
}: {
  name: string;
  value: number | string;
  size?: "lg" | "xl";
}) => {
  return (
    <Card
      className={`border-none flex items-center justify-center ${
        size === "xl" ? "w-24 h-24" : "w-20 h-12"
      } rounded-md shadow-project-attribute-box-custom`}
    >
      <div className="flex flex-col items-center justify-center text-primary font-sen">
        <p
          className={`font-bold text-center ${
            size === "xl" ? "text-xl" : "text-sm"
          }`}
        >
          {value}
        </p>
        <h2
          className={`font-light ${
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
}: ProjectAttributesContainerProps) => {
  // Create an array of the attributes and their values to map over
  const attributes = Object.entries(items).filter(
    ([_, value]) => value !== undefined
  );

  return (
    <div
      className={`flex w-full items-center justify-between ${
        layout === "horizontal" ? "flex-row" : "flex-col"
      } gap-4`}
    >
      {attributes.map(([name, value], index) => (
        <ProjectAttributeBox
          key={index}
          name={name}
          value={value as number | string}
          size={size} // Apply the size prop (lg or xl) to all boxes
        />
      ))}
    </div>
  );
};

export default ProjectAttributesContainer;
