import { Box, Button, ButtonGroup, Heading, Stack, VStack } from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Container, Input, Link, PasswordInput } from "../../components";
import { useAuth } from "../../hooks/useAuth";
import { route } from "../../routes";

interface FieldValues {
  email: string;
  password: string;
}

export const Login = () => {
  const { loginWithPassword } = useAuth();
  const {
    handleSubmit,
    setError,
    control,
    formState: { isSubmitting },
  } = useForm<FieldValues>({});
  const onSubmit = handleSubmit(async ({ email, password }) => {
    const response = await loginWithPassword(email, password);

    if (response?.errors?.length) {
      const { errors } = response;
      errors.forEach(({ field, message }: any) => setError(field, { message }));
    }
  });

  return (
    <>
      <Helmet title={"Sign in"} />

      <Container pt={{ base: 16, sm: 24 }} pb={10} px={6} maxW={"lg"} mx={"auto"}>
        <VStack alignItems={"stretch"} flexGrow={1} spacing={16}>
          <Heading fontSize={{ base: "4xl", sm: "4xl" }}>Login to your account</Heading>

          <VStack as={"form"} onSubmit={onSubmit} spacing={10} flexGrow={1}>
            <Stack spacing={6} w={"full"}>
              <Box flexGrow={1}>
                <Input
                  autoComplete={"email"}
                  label={"Email"}
                  placeholder={"Enter your email"}
                  name={"email"}
                  control={control}
                  rules={{ required: true }}
                  data-testid={"email"}
                  size={{ base: "lg", lg: "lg" }}
                />
              </Box>

              <Box flexGrow={1}>
                <VStack spacing={{ base: 4, sm: 6 }} alignItems={{ base: "flex-end", sm: "flex-start" }}>
                  <PasswordInput
                    label={"Password"}
                    autoComplete={"current-password"}
                    placeholder={"••••••"}
                    name={"password"}
                    control={control}
                    rules={{ required: true }}
                    data-testid={"password"}
                    size={{ base: "lg", lg: "lg" }}
                  />
                </VStack>
              </Box>
            </Stack>

            <ButtonGroup flexDir={"column"} spacing={0} rowGap={4} size={{ base: "lg", md: "lg" }} w={"full"}>
              <Button
                isLoading={isSubmitting}
                type={"submit"}
                data-testid={"submit"}
                bg={"gray.800"}
                _hover={{ bg: "gray.900" }}
                _active={{ bg: "gray.900" }}
              >
                Sign in
              </Button>

              <Button as={Link} to={route("signUp")} isDisabled={isSubmitting} data-testid={"go-to-signup"}>
                Create new account
              </Button>
            </ButtonGroup>
          </VStack>
        </VStack>
      </Container>
    </>
  );
};
