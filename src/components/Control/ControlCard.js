import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';


// icon
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';
import PauseIcon from '@material-ui/icons/Pause';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import RepeatIcon from '@material-ui/icons/Repeat';
import RepeatOneIcon from '@material-ui/icons/RepeatOne';
import SkipNextIcon from '@material-ui/icons/SkipNext';


import Notabase from 'notabase'
import VolumeCard from './VolumeCard'
import { PhosPlayerContext } from '../PhosPlayerContext'
import ProcessSlider from './ProcessSlider'

const PhosColor = '#38d4c9'

let nb = new Notabase()

const shuffleArray = (arr) => {
  let i = arr.length;
  while (i) {
    let j = Math.floor(Math.random() * i--);
    [arr[j], arr[i]] = [arr[i], arr[j]];
  }
}

const useStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    position: 'absolute',
    bottom: 0,
    width: '100%'
  },
  playControls: {
    maxWidth: '50%',
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    margin: '0 auto'
  },
  songDetails: {
    padding: 10,
    display: 'flex',
    width: '25%'
  },
  cover: {
    width: 80,
    height: '100%',
    minWidth: 80
  },
  content: {
    overflow: 'auto'
  },
  controlBtn: {
    margin: '0 auto'
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  processSlider: {
    maxWidth: '100%',
  },
  volumeWrapper: {
    width: '20%',
  },
  volume: {
    position: 'absolute',
    top: 'calc(50% - 20px)',
    right: '5%',
  },
  active: {
    color: PhosColor
  }
}));

export default function MediaControlCard(props) {
  const classes = useStyles()
  const theme = useTheme()
  const { state, dispatch } = React.useContext(PhosPlayerContext)
  const { playing, repeat, shuffle, currentPlaylist, currentPlaySong } = state
  let _currentPlaylist = currentPlaylist

  const getCover = () => {
    if (currentPlaySong && currentPlaySong.title && currentPlaySong.album && currentPlaySong.album[0] && currentPlaySong.album[0].cover) {
      return nb.parseImageUrl(currentPlaySong.album[0].cover[0], 100)
    } else {
      return ''
    }
  }
  return (
    <div>
      <Card className={classes.card}>
        <div className={classes.songDetails}>
          <CardMedia
            className={classes.cover}
            image={currentPlaySong.title && getCover()}
            title={currentPlaySong.title}
          />
          <CardContent className={classes.content}>
            <Typography component="h5" variant="h5" noWrap>
              {currentPlaySong.title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" noWrap>
              {currentPlaySong.artist && currentPlaySong.artist.map(a => a.name).join(",")}
            </Typography>
          </CardContent>
        </div>

        <div className={classes.playControls}>
          <div className={classes.controlBtn}>
            <IconButton aria-label="shuffle" onClick={
              () => {
                dispatch({
                  type: 'setPlayerConfig',
                  payload: {
                    name: 'shuffle',
                    value: !shuffle
                  }
                })

                if (!shuffle) {
                  // 打乱当前播放列表
                  shuffleArray(_currentPlaylist)

                  dispatch({
                    type: 'setPlayerConfig',
                    payload: {
                      name: 'currentPlaylist',
                      value: _currentPlaylist
                    }
                  })
                }
              }
            }>
              <ShuffleIcon className={shuffle ? classes.active : ''} />
            </IconButton>

            <IconButton aria-label="previous" onClick={
              () => {
                dispatch({
                  type: 'prev'
                })
              }
            }>
              {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
            </IconButton>
            <IconButton aria-label="play/pause" onClick={() => dispatch({ type: 'play' })}>
              {
                playing ? <PauseIcon className={classes.playIcon} /> : <PlayIcon className={classes.playIcon} />
              }

            </IconButton>
            <IconButton aria-label="next" onClick={
              () => {
                dispatch({
                  type: 'next'
                })
              }
            }>
              {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
            </IconButton>
            <IconButton aria-label="loop" onClick={() => {
              dispatch({
                type: 'setRepeat'
              })
            }}>
              {
                repeat === 'one' ? <RepeatOneIcon className={classes.active} /> : <RepeatIcon className={repeat === 'list' ? classes.active : ''} />
              }
            </IconButton>
          </div>
          <div className={classes.processSlider}>
            <ProcessSlider seekTo={props.seekTo} />
          </div>
        </div>

        <div className={classes.volumeWrapper}>
          <div className={classes.volume}>
            <VolumeCard />
          </div>
        </div>
      </Card>
    </div>

  );
}
