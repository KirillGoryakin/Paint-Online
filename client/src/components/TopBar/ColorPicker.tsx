import { Box, Flex, Input } from '@chakra-ui/react';
import { useState } from 'react';

type Props = {
  children: string;
  defaultColor: string;
  onBlur: (color: string) => void;
};

const ColorPicker: React.FC<Props> = (props) => {
  const {
    children,
    defaultColor,
    onBlur,
  } = props;

  const [color, setColor] = useState(defaultColor);
  
  return (
    <Flex
      as='label'
      pos='relative'
      alignItems='center'
      boxShadow='2px 2px 3px 1px rgb(0, 0, 0, 0.25)'
      borderRadius={90}
      pl={2}
      userSelect='none'
      cursor='pointer'
    >
      {children}
      <Input
        type='color'
        value={color}
        onChange={e => setColor(e.target.value)}
        onBlur={() => onBlur(color)}
        pos='absolute'
        top='50%' left='50%'
        w={0} h={0} p={0} m={0}
        border={0}
        opacity={0}
      />
      <Box
        ml={2}
        w={8}
        h={8}
        background={color}
        borderRadius={90}
      />
    </Flex>
  )
};

export { ColorPicker };