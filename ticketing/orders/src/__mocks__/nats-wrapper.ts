export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          // Call the callback function to simulate successful publishing
          callback();
        }
      ),
  },
};
