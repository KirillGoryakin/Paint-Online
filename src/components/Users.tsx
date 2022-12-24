import { Text } from "@chakra-ui/react";

const Users = () => {
  const users = ['Oleg', 'Vladimir', 'John', 'Marina', 'Natasha', 'Bob'];
  
  return (
    <div>
      <Text
        display='inline'
        fontSize={28}
        fontWeight={600}
        color='blue.600'
        mr={1}
      >
        Users: 
      </Text>
      <Text
        display='inline'
        fontSize={28}
        fontWeight={600}
        color='green.700'
      >
        {users.join(', ')}
      </Text>
    </div>
  )
}

export { Users };