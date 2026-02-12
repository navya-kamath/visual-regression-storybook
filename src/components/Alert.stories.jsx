import Alert from "./Alert";

export default {
  title: "Common/Alert",
  component: Alert,
};

export const Success = {
  args: {
    message: "Action completed successfully!",
    type: "success",
  },
};

export const Error = {
  args: {
    message: "Something went wrong!",
    type: "error",
  },
};
