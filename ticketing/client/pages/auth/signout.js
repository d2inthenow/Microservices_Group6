import { useEffect } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const SignOut = () => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => {
      // Redirect to the home page or any other page after sign out
      Router.push("/");
    },
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Sign out </div>;
};

export default SignOut;
