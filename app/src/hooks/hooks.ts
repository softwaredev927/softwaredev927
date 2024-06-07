import {
  useState,
  useLayoutEffect,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { matchRoutes, useLocation, useParams } from "react-router-dom";
import { flatRoutes, MOBILE_WIDTH } from "consts";
import {
  Address,
  beginCell,
  Sender,
  SenderArguments,
  storeStateInit,
} from "ton-core";
import { IS_DEV, STRATEGY_ARGUMENTS } from "config";
import { showSuccessToast } from "toasts";
import { Proposal, ProposalStatus, ThemeType } from "types";
import { StringParam, useQueryParams } from "use-query-params";
import { useCommonTranslations } from "i18n/hooks/useCommonTranslations";
import { useMediaQuery } from "@mui/material";
import {
  DaoRoles,
  ProposalMetadata,
} from "ton-vote-contracts-sdk";
import { THEME, useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { useSettingsStore } from "store";
import _ from "lodash";
import {
  getProposalStatus,
} from "utils";
import { useQuery } from "@tanstack/react-query";
export const useCurrentRoute = () => {
  const location = useLocation();
  const route = matchRoutes(flatRoutes, location);

  return route ? route[0].route.path : undefined;
};

export const useWindowResize = () => {
  const [size, setSize] = useState([0, 0]);

  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return size;
};

export const useGetSender = () => {
  const address = useTonAddress();
  const [tonConnect] = useTonConnectUI();
  return useCallback((): Sender => {
    if (!address) {
      throw new Error("Not connected");
    }

    const init = (init: any) => {
      const result = init
        ? beginCell()
            .store(storeStateInit(init))
            .endCell()
            .toBoc({ idx: false })
            .toString("base64")
        : undefined;

      return result;
    };

    return {
      address: Address.parse(address!),
      async send(args: SenderArguments) {
        await tonConnect.sendTransaction({
          validUntil: Date.now() + 5 * 60 * 1000,
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              stateInit: init(args.init),
              payload: args.body
                ? args.body.toBoc().toString("base64")
                : undefined,
            },
          ],
        });
      },
    };
  }, [address]);
};

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>; // Return success

export function useCopyToClipboard(): [CopiedValue, CopyFn] {
  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      showSuccessToast("Copied to clipboard");
      return true;
    } catch (error) {
      console.warn("Copy failed", error);

      return false;
    }
  };

  return [null, copy];
}

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const useDebouncedCallback = (func: any, wait: number = 300) => {
  // Use a ref to store the timeout between renders
  // and prevent changes to it from causing re-renders
  const timeout = useRef<any>();

  return useCallback(
    (...args: any) => {
      const later = () => {
        clearTimeout(timeout.current);
        func(...args);
      };

      clearTimeout(timeout.current);
      timeout.current = setTimeout(later, wait);
    },
    [func, wait]
  );
};

enum Params {
  PROPOSAL_STATE = "proposal-state",
  SEARCH = "search",
  DEV = "dev",
  MODE = "mode",
}

export const useAppQueryParams = () => {
  const [query, setQuery] = useQueryParams({
    [Params.PROPOSAL_STATE]: StringParam,
    [Params.SEARCH]: StringParam,
    [Params.DEV]: StringParam,
    [Params.MODE]: StringParam,
  });

  return {
    query: {
      proposalState: query[Params.PROPOSAL_STATE] as string | undefined,
      search: query.search as string | undefined,
      dev: query.dev as string | undefined,
      mode: query.mode as string | undefined,
    },
    setProposalState: (state: string | undefined) => {
      setQuery({ [Params.PROPOSAL_STATE]: state }, "pushIn");
    },
    setDev: (state: string | undefined) => {
      setQuery({ [Params.DEV]: state }, "pushIn");
    },
    setSearch: (search: string | undefined) => {
      setQuery({ [Params.SEARCH]: search || undefined }, "pushIn");
    },
  };
};

export const useMobile = () => {
  const macthes = useMediaQuery(`(max-width: ${MOBILE_WIDTH}px)`);
  return macthes;
};

export const useDevFeatures = () => {
  const beta = useAppSettings().beta;
  return IS_DEV || beta;
};

export const useRole = (roles?: DaoRoles) => {
  const address = useTonAddress();

  const getRole = (_roles?: DaoRoles) => {
    return {
      isOwner: !_roles ? false : address === _roles.owner,
      isProposalPublisher: !_roles ? false : address === _roles.proposalOwner,
    };
  };

  return {
    ...getRole(roles),
    getRole,
  };
};

export const useAppSettings = () => {
  const store = useSettingsStore();
  const [_, setOptions] = useTonConnectUI();

  const toggleTheme = () => {
    setThemeMode(store.themeMode === "dark" ? "light" : "dark");
  };

  const setThemeMode = (mode: ThemeType) => {
    store.setThemeMode(mode);
    setOptions({
      uiPreferences: {
        theme: mode === "dark" ? THEME.DARK : THEME.LIGHT,
      },
    });
  };

  return {
    isDarkMode: store.themeMode === "dark",
    toggleTheme,
    setThemeMode,
    themeMode: store.themeMode,
    beta: store.beta,
    setBeta: store.setBeta,
  };
};

export const useGetProposalStatusCallback = () => {
  const t = useCommonTranslations();
  return (metadata: ProposalMetadata) => {
    const status = getProposalStatus(metadata!);
    let text;

    if (status === ProposalStatus.ACTIVE) {
      text = t.active;
    }
    if (status === ProposalStatus.CLOSED) {
      text = t.ended;
    }
    if (status === ProposalStatus.NOT_STARTED) {
      text = t.notStarted;
    }

    return {
      proposalStatus: status,
      proposalStatusText: text,
    };
  };
};

export const useAppParams = () => {
  const params = useParams();
  return {
    daoAddress: params.daoId as string,
    proposalAddress: params.proposalId as string,
  };
};
