import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Input, Link, PasswordInput } from "../../components";
import { useLoginWithPasswordMutation } from "../../generated/graphql";

interface FieldValues {
  email: string;
  password: string;
}

export const Login = () => {
  const [, loginWithPassword] = useLoginWithPasswordMutation();
  const navigate = useNavigate();
  const {
    handleSubmit,
    setError,
    control,
    formState: { isSubmitting },
  } = useForm<FieldValues>({});
  const onSubmit = handleSubmit(async (values) => {
    const response = await loginWithPassword(values);

    if (response.data?.loginWithPassword) {
      const { user, errors } = response.data.loginWithPassword;

      if (errors?.length) {
        errors.forEach(({ field, message }) =>
          setError(field as any, { message })
        );
      } else if (user) {
        navigate("/", { replace: true });
      }
    }
  });

  return (
    <Container
      maxW={"lg"}
      py={{ base: "12", md: "24" }}
      px={{ base: "0", sm: "8" }}
    >
      <Stack spacing={"8"}>
        <Stack spacing={"6"}>
          <Stack spacing={{ base: "2", md: "3" }} textAlign={"center"}>
            <Heading size={"lg"}>Log in to your account</Heading>
            <HStack spacing={2} justify={"center"}>
              <Text color={"muted"}>Don't have an account?</Text>
              <Link to={"/signup"} data-testid={"go-to-signup"}>
                Sign up
              </Link>
            </HStack>
          </Stack>
        </Stack>
        <Box
          as={"form"}
          onSubmit={onSubmit}
          py={{ base: "0", sm: "8" }}
          px={{ base: "4", sm: "10" }}
        >
          <Stack spacing={6}>
            <Stack spacing={5}>
              <Input
                type={"email"}
                autoComplete={"email"}
                label={"Email"}
                name={"email"}
                control={control}
                rules={{ required: true }}
                data-testid={"email"}
              />

              <PasswordInput
                label={"Password"}
                autoComplete={"current-password"}
                name={"password"}
                control={control}
                rules={{ required: true }}
                data-testid={"password"}
              />
            </Stack>

            <HStack justifyContent={"flex-end"}>
              <Link to={"/forgot-password"} size={"sm"}>
                Forgot password?
              </Link>
            </HStack>

            <Button
              isLoading={isSubmitting}
              type={"submit"}
              data-testid={"submit"}
            >
              Sign in
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};
