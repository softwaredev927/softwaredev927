import { Box, MenuItem, styled, Typography } from "@mui/material";
import { useCopyToClipboard } from "hooks/hooks";
import React, { ReactNode, useState } from "react";
import { BsReddit, BsTwitter } from "react-icons/bs";
import { FaTelegramPlane } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";
import { RxShare2 } from "react-icons/rx";

import {
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
} from "react-share";
import { StyledFlexRow } from "styles";
import { Menu } from "./Menu";

const CopyBtn = ({ url, children }: { url: string; children: ReactNode }) => {
  const [_, copy] = useCopyToClipboard();

  return <div onClick={() => copy(url)}>{children}</div>;
};

const items = [
  {
    button: RedditShareButton,
    icon: BsReddit,
    text: "Reddit",
  },
  {
    button: TelegramShareButton,
    icon: FaTelegramPlane,
    text: "Telegram",
  },
  {
    button: TwitterShareButton,
    icon: BsTwitter,
    text: "Twitter",
  },
  {
    button: CopyBtn,
    icon: IoCopyOutline,
    text: "Copy Link",
  },
];

export function ShareButton({
  url,
  className = " ",
}: {
  url: string;
  className?: string;
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const close = () => setAnchorEl(null);

  return (
    <>
      <StyledShareButton className={className} onClick={handleClick}>
        <RxShare2 />
        <Typography>Share</Typography>
      </StyledShareButton>
      <Menu anchorEl={anchorEl} setAnchorEl={setAnchorEl}>
        {items.map((it, index) => {
          return (
            <StyledMenuItem key={index} onClick={close}>
              <it.button url={url}>
                <StyledBtnContent>
                  <it.icon />
                  <Typography>{it.text}</Typography>
                </StyledBtnContent>
              </it.button>
            </StyledMenuItem>
          );
        })}
      </Menu>
    </>
  );
}

const StyledMenuItem = styled(MenuItem)({
  svg: {
    width: 16,
    height: 16,
  },
  p: {
    fontSize: 14,
    fontWeight: 600,
  },
});

const StyledShareButton = styled("button")(({ theme }) => {
  const color =
    theme.palette.mode === "light" ? theme.palette.primary.main : "white";
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    background: "transparent",
    border: "unset",
    cursor: "pointer",
    color: color,
    "*": {
      color: color,
    },
    p: {
      fontSize: 15,
      fontWeight: 600,
    },
    svg: {
      width: 20,
      height: 20,
      color: color,
    },
  };
});

const StyledBtnContent = styled(StyledFlexRow)(({ theme }) => ({
  height: 25,
}));
