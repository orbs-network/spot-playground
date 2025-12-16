import { Partners } from "@orbs-network/twap-ui";
import { StringParam, useQueryParam } from "use-query-params";

export const useConfigParams = () => {
  const [partner] = useQueryParam("partner", StringParam);

  return {
    partner: partner as Partners | undefined,
  }
};