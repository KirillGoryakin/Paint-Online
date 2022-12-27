import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Input,
  Text,
} from '@chakra-ui/react';
import { useParams } from 'react-router';
import Store from 'Store/Store';

const ModalWindow = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [username, setUsername] = useState('');
  const [isNameTaken, setIsNameTaken] = useState(false);
  const { id } = useParams();
  
  const handleEnter = async () => {
    if(id && username.trim()){
      const res = await Store.setWebsocketConnection(id, username.trim());

      setIsNameTaken(!res);
      if(res) setIsOpen(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={handleEnter}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Enter your username</ModalHeader>
        <ModalBody>
          <Text
            display={isNameTaken ? 'block' : 'none'}
            color='crimson'
            mb={4}
          >
            This username is already taken. Pick another one.
          </Text>
          <Input
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleEnter()}
            placeholder='Username...'
            focusBorderColor={isNameTaken ? 'crimson' : 'blue.500'}
            borderColor={isNameTaken ? 'crimson' : 'blue.500'}
          />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={handleEnter}>
            Enter
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { ModalWindow };