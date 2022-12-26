import { Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import Store from "Store/Store";

const Users = observer(() => {
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
        {Store.users.join(', ')}
      </Text>
    </div>
  );
});

export { Users };