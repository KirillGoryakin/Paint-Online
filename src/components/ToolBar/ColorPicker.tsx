import { Box, Flex, Input } from "@chakra-ui/react";
import { useState } from "react";

type Props = {
  children: string;
};

const ColorPicker: React.FC<Props> = ({ children }) => {
  const [color, setColor] = useState('#000000');
  
  return (
    <Flex
      as='label'
      alignItems='center'
      boxShadow='2px 2px 3px 1px rgb(0, 0, 0, 0.25)'
      borderRightRadius={90}
      pl={4}
      cursor='pointer'
    >
      {children}
      <Box
        ml={4}
        w={24}
        h={24}
        background={color}
        borderRadius={90}
      />
      <Input
        type='color'
        value={color}
        onChange={e => setColor(e.target.value)}
        w={0}
        h={0}
        border={0}
        opacity={0}
      />
    </Flex>
  )
}

export { ColorPicker };