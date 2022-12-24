import {
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper
} from "@chakra-ui/react";

const WidthPicker = () => {
  return (
    <Flex
      as='label'
      alignItems='center'
      gap={2}
    >
      Width: 
      <NumberInput
        defaultValue={8}
        min={1} max={64}
        allowMouseWheel
        size='sm'
        mr={8}
      >
        <NumberInputField w={20} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </Flex>
  )
}

export { WidthPicker };