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
import {
  FaRegSave
} from 'react-icons/fa';
import { TopBarButton } from './TopBarButton';
import { ColorPicker } from './ColorPicker';
import { WidthPicker } from './WidthPicker';
import Store from 'Store/Store';
import Brush from 'Tools/Brush';
import Eraser from 'Tools/Eraser';
import Line from 'Tools/Line';
import Rect from 'Tools/Rect';
import Circle from 'Tools/Circle';

const TopBar = observer(() => {
  return (
    <Flex
      borderBottom='3px solid #000'
      px={8}
      py={2}
      justifyContent='space-between'
    >
      <Flex gap={2}>
        <TopBarButton tool={Brush}><BsBrush size={24} /></TopBarButton>
        <TopBarButton
          tool={Eraser}
          onDoubleClick={() => Store.clearCanvas()}
        ><BsEraser size={24} /></TopBarButton>
        <TopBarButton tool={Line}><BsSlashLg size={24} /></TopBarButton>
        <TopBarButton tool={Rect}><BiRectangle size={24} /></TopBarButton>
        <TopBarButton tool={Circle}><BsCircle size={24} /></TopBarButton>
      </Flex>
      <Flex gap={4}>
        <ColorPicker
          defaultColor={Store.color}
          onBlur={Store.setColor}
        >Color:</ColorPicker>
        <WidthPicker />
      </Flex>
      <Flex gap={2}>
        <TopBarButton><FaRegSave size={24} /></TopBarButton>
        <TopBarButton><BiUndo size={24} /></TopBarButton>
        <TopBarButton><BiUndo size={24} style={{ transform: 'scaleX(-1)' }} /></TopBarButton>
      </Flex>
    </Flex>
  )
});

export { TopBar };