import { Flex, Heading } from '@chakra-ui/react';
import { useParams } from 'react-router';
import { FiLink } from 'react-icons/fi';

const RoomCode = () => {
  const params = useParams();
  
  return (
    <Flex
      alignItems='center'
      justifyContent='space-between'
      mb={4}
    >
      <Heading
        size='2xl'
        color='red.500'
      >
        Room Code: {params?.id || ''}
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
  )
}

export { RoomCode };