import { Helmet } from "react-helmet";
import { Navigate, useParams } from "react-router-dom";
import { useFindProjectBySlugQuery } from "../../generated/graphql";
import { route } from "../../routes";

export const Project = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const [{ data, fetching, error }] = useFindProjectBySlugQuery({ variables: { slug } });

  if (fetching) return <>Loading</>; // TODO: Add skeleton
  if (!data && error) return <>Something went wrong: {error.message}</>;
  if (!data?.project) return <Navigate to={route("index")} />;

  const { title } = data.project;

  return (
    <>
      <Helmet title={title} />

      {title}
    </>
  );
};
