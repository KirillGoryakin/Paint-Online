import { Box } from "@chakra-ui/react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
};

const ToolButton: React.FC<Props> = ({ children, onClick = () => {} }) => {
  return (
    <Box
      display='flex'
      onClick={onClick}
      borderRadius={10}
      p={4}
      cursor='pointer'
      boxShadow='2px 2px 3px 0px rgb(0, 0, 0, 0.25)'
      transition='box-shadow 0.1s ease-in-out'
      _hover={{
        boxShadow: 'none'
      }}
    >
      {children}
    </Box>
  )
}

export { ToolButton };