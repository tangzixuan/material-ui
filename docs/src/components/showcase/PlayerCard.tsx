import * as React from 'react';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Fade from '@mui/material/Fade';
import IconButton, { iconButtonClasses } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FastForwardRounded from '@mui/icons-material/FastForwardRounded';
import FastRewindRounded from '@mui/icons-material/FastRewindRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import PauseRounded from '@mui/icons-material/PauseRounded';
import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded';
import LoopRoundedIcon from '@mui/icons-material/LoopRounded';

export default function PlayerCard({ disableTheming }: { disableTheming?: boolean }) {
  const [paused, setPaused] = React.useState(true);
  return (
    <Fade in timeout={700}>
      <Card
        variant="outlined"
        sx={[
          {
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            borderColor: 'grey.100',
            ...(!disableTheming && {
              [`& .${iconButtonClasses.root}`]: {
                border: '1px solid',
                bgcolor: 'primary.50',
                color: 'primary.500',
                borderColor: 'primary.200',
              },
              [`& .${iconButtonClasses.disabled}`]: {
                height: 'fit-content',
                bgcolor: 'transparent',
                border: '1px solid',
                borderColor: 'grey.100',
                color: 'grey.300',
              },
            }),
          },
          !disableTheming &&
            ((theme) =>
              theme.applyDarkStyles({
                bgcolor: 'primaryDark.900',
                borderColor: 'primaryDark.700',
                [`& .${iconButtonClasses.root}`]: {
                  bgcolor: 'primary.900',
                  color: 'primary.200',
                  borderColor: 'primary.600',
                },
                [`& .${iconButtonClasses.disabled}`]: {
                  bgcolor: 'transparent',
                  border: '1px solid',
                  borderColor: 'primaryDark.600',
                  color: 'primaryDark.400',
                },
              })),
        ]}
      >
        <CardMedia
          component="img"
          width="214"
          height="187"
          alt="Beside Myself album cover"
          src="/static/images/cards/birds-of-tokyo.jpg"
          sx={{
            borderRadius: 0.6,
            height: 100,
            width: '100%',
            mb: 2,
          }}
        />
        <Stack direction="column" spacing={2} alignItems="center">
          <Stack direction="column" spacing={0.2} alignItems="center">
            <Typography color="text.primary" fontWeight={600} fontSize={15} mb={0}>
              If This Ship Sinks (I Give In)
            </Typography>
            <Typography component="div" variant="caption" color="text.secondary" fontWeight={500}>
              Birds Of Tokyo
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <IconButton aria-label="shuffle" disabled size="small" sx={{ flexGrow: 0 }}>
              <ShuffleRoundedIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label="fast rewind" disabled size="small">
              <FastRewindRounded fontSize="small" />
            </IconButton>
            <IconButton
              aria-label={paused ? 'play' : 'pause'}
              sx={{ mx: 1 }}
              onClick={() => setPaused((val) => !val)}
            >
              {paused ? <PlayArrowRounded /> : <PauseRounded />}
            </IconButton>
            <IconButton aria-label="fast forward" disabled size="small">
              <FastForwardRounded fontSize="small" />
            </IconButton>
            <IconButton aria-label="loop" disabled size="small">
              <LoopRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </Card>
    </Fade>
  );
}
