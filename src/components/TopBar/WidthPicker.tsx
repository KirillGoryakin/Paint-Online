import { observer } from "mobx-react-lite";
import {
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper
} from "@chakra-ui/react";
import Store from "Store/Store";

const WidthPicker = observer(() => {
  return (
    <Flex
      as='label'
      alignItems='center'
      gap={2}
      ml={2}
    >
      Width:
      <NumberInput
        defaultValue={1}
        min={1} max={64}
        allowMouseWheel
        value={Store.lineWidth}
        onChange={value => Store.setLineWidth(Number(value))}
        size='sm'
      >
        <NumberInputField w={20} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </Flex>
  )
});

export { WidthPicker };