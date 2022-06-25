import { Text, Box, Button, ButtonGroup, Heading, Stack } from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Link, Container, Input, PasswordInput } from "../../components";
import { useAuth } from "../../hooks/useAuth";
import { route } from "../../routes";

interface FieldValues {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export const SignUp = () => {
  const { createUser } = useAuth();
  const {
    handleSubmit,
    setError,
    control,
    formState: { isSubmitting },
  } = useForm<FieldValues>({});
  const onSubmit = handleSubmit(async ({ username, email, password, passwordConfirm }) => {
    if (password !== passwordConfirm) {
      setError("passwordConfirm", { message: "Passwords must match." });
      return;
    }

    const response = await createUser(username, email, password);

    if (response?.errors?.length) {
      const { errors } = response;
      errors.forEach(({ field, message }: any) => setError(field, { message }));
    }
  });

  return (
    <>
      <Helmet title={"Sign up"} />

      <Container pt={{ base: 16, sm: 24 }} pb={10} px={6} maxW={"lg"} mx={"auto"}>
        <Stack spacing={16}>
          <Heading fontSize={{ base: "4xl", sm: "4xl" }}>Create new account</Heading>

          <Stack as={"form"} onSubmit={onSubmit} justifyContent={"center"} alignItems={"stretch"} spacing={8}>
            <Box flexGrow={1}>
              <Input
                label={"Username"}
                name={"username"}
                autoComplete={"username"}
                placeholder={"jhon doe"}
                size={"lg"}
                control={control}
                rules={{ required: true }}
                data-testid={"username"}
              />
            </Box>

            <Box flexGrow={1}>
              <Input
                label={"Email"}
                name={"email"}
                type={"email"}
                size={"lg"}
                placeholder={"jhondoe@example.com"}
                autoComplete={"email"}
                control={control}
                rules={{ required: true }}
                data-testid={"email"}
              />
            </Box>

            <Box flexGrow={1}>
              <PasswordInput
                label={"Password"}
                name={"password"}
                size={"lg"}
                placeholder={"At least +4 chars"}
                autoComplete={"new-password"}
                control={control}
                rules={{ required: true }}
                data-testid={"password"}
              />
            </Box>

            <Box flexGrow={1}>
              <PasswordInput
                label={"Confirm password"}
                name={"passwordConfirm"}
                size={"lg"}
                placeholder={"••••••"}
                autoComplete={"off"}
                control={control}
                rules={{ required: true }}
                data-testid={"passwordConfirm"}
              />
            </Box>

            <Button isLoading={isSubmitting} type={"submit"} data-testid={"submit"} size={"lg"}>
              Create account
            </Button>

            <Text textAlign={"center"} fontSize={"lg"}>
              Already have an account?{" "}
              <Link color={"blue"} to={route("login")}>
                Log in
              </Link>
            </Text>

            <ButtonGroup
              flexDir={"column"}
              spacing={0}
              rowGap={6}
              size={{ base: "lg", md: "lg" }}
              w={"full"}
            ></ButtonGroup>
          </Stack>
        </Stack>
      </Container>
    </>
  );
};
