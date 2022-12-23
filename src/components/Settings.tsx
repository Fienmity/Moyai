import { SettingsStore } from "enmity/api/settings";
import { Button, FormInput, FormRow, FormSection, ScrollView, TouchableOpacity } from "enmity/components";
import { getByProps } from "enmity/metro";
import { React } from "enmity/metro/common";

const Video = getByProps("DRMType", "FilterType").default

interface SettingsProps {
	settings: SettingsStore;
}

export default function Settings({ settings }: SettingsProps) {
	const [paused, setPaused] = React.useState(true)
	React.useEffect(() =>
		() => {
			if (!settings.get("volume")) {
				settings.set("volume", "1")
			}
		}, [])

	return <ScrollView>
		<FormSection title="🗿">
			<FormInput title="Volume"
				placeholder="69"
				keyboardType='numeric'
				value={settings.get("volume")}
				onChange={(value) => settings.set('volume', value)}
			/>
			<TouchableOpacity onPress={() => setPaused(false)}>
				<FormRow label="Test volume" />
			</TouchableOpacity>
		</FormSection>
		<Video
			source={{ uri: "https://github.com/FierysDiscordAddons/Moyai/raw/main/src/boom.mp4" }}
			audioOnly={true}
			paused={paused}
			repeat={true}
			onEnd={() => setPaused(true)}
			volume={Number(settings.get("volume"))} />
	</ScrollView>;
}