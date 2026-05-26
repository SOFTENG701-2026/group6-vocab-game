import Image from "next/image";
import Button from "@/components/button";
import {
  OptionType,
  ColorOption,
  ShapeOption,
  PendingSelection
} from "@/domain/ingredients-match-type";

type MatchOptionColumnProps = {
  type: OptionType;
  options: Array<ColorOption | ShapeOption>;
  pendingSelection: PendingSelection;
  matchedOptionId: string | null;
  isTypeMatched: boolean;
  onOptionClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    type: OptionType,
    id: string
  ) => void;
};

export default function MatchOptionColumn({
  type,
  options,
  pendingSelection,
  matchedOptionId,
  isTypeMatched,
  onOptionClick
}: MatchOptionColumnProps) {
  return (
    <div className='flex flex-col gap-4'>
      {options.map((option) => {
        const isSelected =
          pendingSelection?.type === type && pendingSelection.id === option.id;

        const isMatched = matchedOptionId === option.id;

        const buttonClassName =
          isSelected || isMatched
            ? "border-blue-500 opacity-100"
            : "border-white";

        //Adjust styling of buttons if it's a color or shape
        if (type === "color" && "value" in option) {
          return (
            <Button
              key={option.id}
              variant='ingredientColor'
              onClick={(event) => onOptionClick(event, type, option.id)}
              disabled={isTypeMatched && !isMatched}
              className={buttonClassName}
              style={{ backgroundColor: option.value }}
              aria-label={option.label}
            />
          );
        }

        return (
          <Button
            key={option.id}
            variant='ingredientShape'
            onClick={(event) => onOptionClick(event, type, option.id)}
            disabled={isTypeMatched && !isMatched}
            className={buttonClassName}
          >
            {"imageSrc" in option && option.imageSrc ? (
              <Image src={option.imageSrc} alt={option.label} width={64} height={64} />
            ) : (
              option.label
            )}
          </Button>
        );
      })}
    </div>
  );
}
