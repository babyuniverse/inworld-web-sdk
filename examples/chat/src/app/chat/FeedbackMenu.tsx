import { DislikeType } from '@inworld/web-sdk';
import { ThumbDown, ThumbUp } from '@mui/icons-material';
import { Box, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import * as React from 'react';

import { Feedback } from '../types';

export function FeedbackMenu({
  feedback,
  interactionId,
  handleLike,
  handleDislike,
}: {
  feedback: Feedback;
  interactionId: string;
  handleLike: (interactionId: string) => Promise<void>;
  handleDislike: (interactionId: string, type: DislikeType) => Promise<void>;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [sending, setSending] = React.useState(false);

  const open = Boolean(anchorEl);
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const onLikeClick = React.useCallback(async () => {
    setSending(true);
    await handleLike(interactionId);
    setSending(false);
  }, [feedback, interactionId, handleLike]);
  const onDislikeClick = React.useCallback(
    async (type: DislikeType) => {
      setSending(true);
      await handleDislike(interactionId, type);
      handleClose();
      setSending(false);
    },
    [feedback, interactionId, handleLike],
  );

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Like">
          <span>
            <IconButton
              sx={{ opacity: feedback?.isLike ? 1 : 0.3 }}
              onClick={onLikeClick}
              disabled={!!feedback || sending}
            >
              <ThumbUp fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip
          title={`Dislike${
            feedback?.type ? ` ${feedback.type.toString()}` : ''
          }`}
        >
          <span>
            <IconButton
              onClick={handleOpen}
              size="small"
              sx={{ ml: 2, opacity: feedback?.isLike === false ? 1 : 0.3 }}
              disabled={!!feedback || sending}
              aria-controls={open ? 'feeback-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <ThumbDown fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="feeback-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {Object.keys(DislikeType).map((type) => (
          <MenuItem
            key={type}
            onClick={() => onDislikeClick(type as DislikeType)}
          >
            {type}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
}
