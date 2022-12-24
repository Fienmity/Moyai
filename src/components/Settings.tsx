import { SettingsStore } from "enmity/api/settings";
import { Text, FormInput, FormRow, FormSection, ScrollView, TouchableOpacity } from "enmity/components";
import { getByProps } from "enmity/metro";
import { React } from "enmity/metro/common";
import { get } from "enmity/api/settings";
import { StyleSheet, Constants } from "enmity/metro/common";
import Manifest from '../manifest.json'

const Video = getByProps("DRMType", "FilterType").default

interface SettingsProps {
	settings: SettingsStore;
}

export default function Settings({ settings }: SettingsProps) {
	const [paused, setPaused] = React.useState(true)
	const styles = StyleSheet.createThemedStyleSheet({
		item: {
			color: Constants.ThemeColorMap.HEADER_PRIMARY
		}
	})
	React.useEffect(() => {
		() => {
			settings.get("volume") ?? settings.set("volume", "1");
		}
	}, []);

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
		<FormSection title="🗿">
			<FormRow 
				label='Moyai Counter' 
				subLabel="This is probably innacurate (aka 🗿🗿🗿🗿)"
				trailing={() => <Text style={styles.item}>
					{Number(get(Manifest.name, 'moyaiCounter', 0))
				}</Text>} 
			/>
		</FormSection>
		<Video
			source={{ uri: "https://github.com/FierysDiscordAddons/Moyai/raw/main/src/boom.mp4" }}
			audioOnly={true}
			paused={paused}
			repeat={true}
			onEnd={() => setPaused(true)}
			volume={Number(settings.get("volume"))} 
		/>
	</ScrollView>;
}