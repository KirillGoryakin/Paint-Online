import { Text } from "@chakra-ui/react";

const Credits = () => {
  return (
    <>
      <Text
        fontSize={36}
        fontWeight={600}
        textAlign='center'
        mb={2}
      >
        Paint Online by
        <Text
          as='a'
          href='https://github.com/kirillgoryakin/'
          target='_blank'
          ml={4}
          color='cyan.800'
          textDecoration='underline'
        >
          Kirill Goryakin
        </Text>
      </Text>
      <Text
        as='a'
        href='https://github.com/KirillGoryakin/Paint-Online/'
        target='_blank'
        display='block'
        fontSize={28}
        fontWeight={600}
        textAlign='center'
        color='cyan.800'
        textDecoration='underline'
      >
        View GitHub repository
      </Text>
    </>
  )
}

export { Credits };