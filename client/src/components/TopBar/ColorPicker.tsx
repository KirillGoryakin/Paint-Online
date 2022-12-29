import { Box, Flex, Input } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import Store from 'Store/Store';

type Props = {
  children: string;
};

const ColorPicker: React.FC<Props> = observer(({ children }) => {
  const [color, setColor] = useState(Store.color);

  const handleBlur = () => {
    Store.setColor(color);
    Store.setClickable(true);
  } 

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
        onFocus={() => Store.setClickable(false)}
        onBlur={handleBlur}
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
});

export { ColorPicker };