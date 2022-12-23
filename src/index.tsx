import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { getByName, getByProps } from 'enmity/metro';
import { Messages, React } from 'enmity/metro/common';
import { create } from 'enmity/patcher';
import Manifest from './manifest.json';


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
   return content.includes("🗿") || content.includes("moyai") || content.includes("maoi") || content.includes("vine boom")
}
const Moyai: Plugin = {
   ...Manifest,

   onStart() {
      let attempt = 0
      const attempts = 3

      const lateStart = () => {
         try {
            attempt++

            for (const handler of ["MESSAGE_CREATE", "MESSAGE_UPDATE"]) {
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

            
            // Patch chat header to hold video component(s) for vine boom
            patcher.instead(ChatBanner, "default", (self, args, orig) => {
               const channelId = args[0].channel.id
               const [paused, setPaused] = React.useState(true)

               patcher.after(MessageCreate, "actionHandler", (self, args, orig) => {
                  console.log(args)
                  if (args[0].channelId === channelId && args[0].message.content && isBoomWorthy(args[0].message.content)) {
                     setPaused(false)
                  }
               })

               patcher.after(MessageUpdate, "actionHandler", (self, args, orig) => {
                  console.log(args)
                  if (args[0].channelId === channelId && args[0].message.content && isBoomWorthy(args[0].message.content)) {
                     setPaused(false)
                  }
               })

               return <>
                  {orig.apply(self, args)}
                  <Video source={{ uri: "https://github.com/FierysDiscordAddons/Moyai/raw/main/src/boom.mp4" }} audioOnly={true} paused={paused} repeat={true} onEnd={() => setPaused(true)} />
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
};

registerPlugin(Moyai);
