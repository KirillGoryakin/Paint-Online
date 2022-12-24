import { observer } from 'mobx-react-lite';
import { Flex } from '@chakra-ui/react';
import {
  BsBrush,
  BsEraser,
  BsSlashLg,
  BsCircle,
} from 'react-icons/bs';
import {
  BiRectangle,
  BiUndo,
} from 'react-icons/bi';
import { ToolButton } from './ToolButton';
import { ColorPicker } from './ColorPicker';
import { WidthPicker } from './WidthPicker';
import Store from 'Store/Store';

const ToolBar = observer(() => {
  return (
    <Flex
      borderBottom='3px solid #000'
      px={8}
      py={2}
      justifyContent='space-between'
    >
      <Flex gap={2}>
        <ToolButton><BsBrush size={24} /></ToolButton>
        <ToolButton><BsEraser size={24} /></ToolButton>
        <ToolButton><BsSlashLg size={24} /></ToolButton>
        <ToolButton><BiRectangle size={24} /></ToolButton>
        <ToolButton><BsCircle size={24} /></ToolButton>
      </Flex>
      <Flex gap={4}>
        <ColorPicker
          defaultColor={Store.strokeColor}
          onBlur={Store.setStrokeColor}
        >Stroke Color:</ColorPicker>
        <ColorPicker
          defaultColor={Store.fillColor}
          onBlur={Store.setFillColor}
        >Fill Color:</ColorPicker>
      </Flex>
      <Flex gap={2}>
        <WidthPicker />
        <ToolButton><BiUndo size={24} /></ToolButton>
        <ToolButton><BiUndo size={24} style={{ transform: 'scaleX(-1)' }} /></ToolButton>
      </Flex>
    </Flex>
  )
});

export { ToolBar };