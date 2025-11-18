import React from 'react';
import Link from 'next/link';
import { Avatar, Typography, Box } from '@mui/material';
import Chip from '@mui/material/Chip';
import OutlinedCard from './OutlinedCard';
import type { AppData } from '@/types/index.d';
import Text from './i18n';

interface AppGridItemProps extends AppData {
  selected?: boolean;
}

const AppGridItem = ({
  channel,
  name,
  description,
  status,
  link,
  selected,
  icon,
  id,
}: AppGridItemProps) => {
  const attr = channel === 'external'
    ? {
        href: link,
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {
        component: id,
        href: '/app/' + id,
      };

  const Inner = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px',
        height: '100%',
        width: '100%',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <Box sx={{ flex: '1 0 auto', display: 'flex', alignItems: 'center' }}>
        <Avatar
          sx={{ width: 56, height: 56 }}
          alt={name + "的图标"}
          src={icon}
        />
      </Box>
      <Typography
        variant="subtitle2"
        align="center"
        sx={{ 
          fontFamily: 'Product Sans Bold',
          mt: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}
      >
        {name}
        {status === 'beta' && (
          <Chip
            label={<Text k="channel.wip" />}
            size="small"
            variant="outlined"
          />
        )}
      </Typography>
    </Box>
  );

  if (status === 'beta') {
    return (
      <OutlinedCard sx={{ height: '100%', display: 'flex' }}>
        <Inner />
      </OutlinedCard>
    );
  }

  return (
    <Link {...attr} style={{ height: '100%', display: 'flex' }}>
      {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
      }
      <OutlinedCard sx={{ height: '100%', display: 'flex' }}>
        <Inner />
      </OutlinedCard>
    </Link>
  );
};

export default AppGridItem; 
