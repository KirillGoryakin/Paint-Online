import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import Store from "Store/Store";
import Tool from "Tools/Tool";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  onDoubleClick?: () => void;
  tool?: typeof Tool;
};

const TopBarButton: React.FC<Props> = observer((props) => {
  const {
    children,
    onClick = () => {},
    onDoubleClick = () => {},
    tool,
  } = props;

  const selected = tool && Store.tool instanceof tool;

  return (
    <Box
      onClick={tool ? () => Store.setTool(tool) : onClick}
      onDoubleClick={onDoubleClick}
      userSelect='none'
      display='flex'
      border={'2px solid transparent'}
      borderColor={selected ? 'blue.400' : 'transparent'}
      borderRadius={10}
      p={1}
      cursor='pointer'
      boxShadow='2px 2px 3px 0px rgb(0, 0, 0, 0.25)'
      transition={`
        box-shadow 0.1s ease-in-out,
        border-color 0.1s ease-in-out
      `}
      _hover={{
        boxShadow: 'none'
      }}
    >
      {children}
    </Box>
  )
});

export { TopBarButton };