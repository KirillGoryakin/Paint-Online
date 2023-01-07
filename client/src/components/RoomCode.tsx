import { Flex, Heading } from '@chakra-ui/react';
import { useParams } from 'react-router';
import { FiLink } from 'react-icons/fi';
import Store from 'Store/Store';
import { observer } from 'mobx-react-lite';

const RoomCode = observer(() => {
  const params = useParams();

  return Store.socket ? (
    <Flex
      alignItems='center'
      justifyContent='space-between'
      mb={4}
    >
      <Heading
        size='2xl'
        color='red.500'
      >
        Room ID: {params?.roomId || ''}
      </Heading>

      <Heading
        onClick={() => navigator.clipboard.writeText(window.location.href)}
        display='flex'
        alignItems='center'
        gap={1}
        size='xl'
        color='blue.500'
        textDecor='underline'
        cursor='pointer'
      >
        Copy Link <FiLink />
      </Heading>
    </Flex>
  ) : null;
});

export { RoomCode };