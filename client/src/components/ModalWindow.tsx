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
} from '@chakra-ui/react';
import { useParams } from 'react-router';
import Store from 'Store/Store';

const ModalWindow = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [username, setUsername] = useState('');
  const { id } = useParams();
  
  const handleEnter = () => {
    if(id && username){
      Store.setWebsocketConnection(id, username);
      setIsOpen(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={handleEnter}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Enter your username</ModalHeader>
        <ModalBody>
          <Input
            value={username}
            onChange={e => setUsername(e.target.value.trim())}
            placeholder='Username...'
            onKeyDown={e => e.key === "Enter" && handleEnter()}
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