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
import { TopBarButton } from './TopBarButton';
import { ColorPicker } from './ColorPicker';
import { WidthPicker } from './WidthPicker';
import Store from 'Store/Store';
import Brush from 'Tools/Brush';
import Eraser from 'Tools/Eraser';

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
        <TopBarButton><BsSlashLg size={24} /></TopBarButton>
        <TopBarButton><BiRectangle size={24} /></TopBarButton>
        <TopBarButton><BsCircle size={24} /></TopBarButton>
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
        <TopBarButton><BiUndo size={24} /></TopBarButton>
        <TopBarButton><BiUndo size={24} style={{ transform: 'scaleX(-1)' }} /></TopBarButton>
      </Flex>
    </Flex>
  )
});

export { TopBar };