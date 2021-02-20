import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';

import reducers, { namespace } from './states';

const PLUGIN_NAME = 'ChangeHoldMusicPlugin';

export default class ChangeHoldMusicPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    this.registerReducers(manager);

    manager.workerClient.on('reservationCreated', reservation => {
      // check if task is a voice task
      if(reservation.task.taskChannelUniqueName=="voice"){
        console.log("Task is a voice task")
        // replace hold music by modifying the HoldCall Action
        flex.Actions.replaceAction("HoldCall", (payload, original) => {
          const holdMusicUrl = "http://com.twilio.music.ambient.s3.amazonaws.com/gurdonark_-_Exurb.mp3";
          return original({ ...payload, holdMusicUrl });
      });

      }
    })
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint: disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
