import { get, set } from 'enmity/api/settings';
import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { getByName, getByProps } from 'enmity/metro';
import { React } from 'enmity/metro/common';
import { create } from 'enmity/patcher';
import Settings from './components/Settings';
import Manifest from './manifest.json';
import { Storage } from 'enmity/metro/common';

const FluxDispatcher = getByProps(
   "_currentDispatchActionType",
   "_subscriptions",
   "_actionHandlers",
   "_waitQueue"
);

const ChatBanner = getByName("ChatBanner", { default: false })
const Video = getByProps("DRMType", "FilterType").default

const patcher = create('moyai')

function isBoomWorthy(content: string) {
   content = content.toLowerCase()
   return ["🗿", "moyai", "moai", "boom", "vine", "💥"].some((trigger) => content.includes(trigger))
}

const Moyai: Plugin = {
   ...Manifest,

   onStart() {
      if (!get(Manifest.name, "volume")) {
         set(Manifest.name, "volume", "1")
      }

      let attempt = 0
      const attempts = 3

      const lateStart = () => {
         try {
            attempt++

            for (const handler of ["MESSAGE_CREATE", "MESSAGE_UPDATE", "MESSAGE_REACTION_ADD"]) {
               try {
                  FluxDispatcher.dispatch({
                     type: handler,
                     message: {},
                  });
               } catch (err) {
                  console.log(`[${Manifest.name} Dispatch Error]`, err);
               }
            }

            const MessageCreate = FluxDispatcher._actionHandlers._orderedActionHandlers?.MESSAGE_CREATE.find(
               (h: any) => h.name === "MessageStore"
            );

            const MessageUpdate = FluxDispatcher._actionHandlers._orderedActionHandlers?.MESSAGE_UPDATE.find(
               (h: any) => h.name === "MessageStore"
            );

            const MessageReactionAdd = FluxDispatcher._actionHandlers._orderedActionHandlers?.MESSAGE_REACTION_ADD.find(
               (h: any) => h.name === "MessageStore"
            );



            // Patch chat header to hold video component(s) for vine boom
            patcher.instead(ChatBanner, "default", (self, args, orig) => {
               const channelId = args[0].channel.id
               const [paused, setPaused] = React.useState(true)
               let vid;

               patcher.after(MessageCreate, "actionHandler", (self, args, orig) => {
                  if (args[0].channelId === channelId && args[0].message.content && isBoomWorthy(args[0].message.content)) {
                     vid.seek(0)
                     if (paused) setPaused(false)
                     set(Manifest.name, 'moyaiCounter', Number(get(Manifest.name, 'moyaiCounter', 0))+1)
                  }
               })

               patcher.after(MessageUpdate, "actionHandler", (self, args, orig) => {
                  if (args[0].channelId === channelId && args[0].message.content && isBoomWorthy(args[0].message.content)) {
                     vid.seek(0)
                     if (paused) setPaused(false)
                     set(Manifest.name, 'moyaiCounter', Number(get(Manifest.name, 'moyaiCounter', 0))+1)
                  }
               })

               patcher.after(MessageReactionAdd, "actionHandler", (self, args, orig) => {
                  if (args[0].channelId === channelId && isBoomWorthy(args[0].emoji.name)) {
                     vid.seek(0)
                     if (paused) setPaused(false)
                     set(Manifest.name, 'moyaiCounter', Number(get(Manifest.name, 'moyaiCounter', 0))+1)
                  }
               })

               return <>
                  {orig.apply(self, args)}
                  <Video ref={(ref) => { vid = ref }}
                     source={{ uri: "https://github.com/FierysDiscordAddons/Moyai/raw/main/src/boom.mp4" }}
                     audioOnly={true}
                     paused={paused}
                     volume={Number(get(Manifest.name, "volume"))} />
               </>
            })
         } catch {
            if (attempt < attempts) {
               setTimeout(() => lateStart(), attempt * 1000)
            }
         }
      }

      setTimeout(() => lateStart(), 300)
   },

   onStop() {
      patcher.unpatchAll()
   },

   getSettingsPanel({ settings }) {
      return <Settings settings={settings} />;
   },
};

registerPlugin(Moyai);
