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
  const [open, setOpen] = useState(true);
  const [username, setUsername] = useState('');
  const [isNameTaken, setIsNameTaken] = useState(false);
  const [serverError, setServerError] = useState(false);
  const { roomId } = useParams();
  
  const handleEnter = async () => {
    if (roomId && username.trim()){
      try {
        const isTaken = await Store.isUsernameTaken(roomId, username);
        setIsNameTaken(isTaken);

        if (!isTaken) {
          await Store.setWebsocketConnection(roomId, username.trim());
          setOpen(false);
        }
      } catch(e) {
        setServerError(true);
      }
    }
  };
  
  return (
    <Modal isOpen={open} onClose={handleEnter}>
      <ModalOverlay />
      {!serverError ? 
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
        :
        <ModalServerError setOpen={setOpen} />
      }
    </Modal>
  )
};

const ModalServerError =
  ({ setOpen }: { setOpen: (value: boolean) => void }) =>
    <ModalContent>
      <ModalHeader>Server Error</ModalHeader>
      <ModalBody>
        <Text
          color='crimson'
          mb={4}
        >
          A server error occured {':('} You can continue offline.
        </Text>
      </ModalBody>

      <ModalFooter>
        <Button colorScheme='blue' mr={3} onClick={() => setOpen(false)}>
          Continue offline
        </Button>
      </ModalFooter>
    </ModalContent>

export { ModalWindow };