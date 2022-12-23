import { SettingsStore } from "enmity/api/settings";
import { FormInput, FormSection, ScrollView } from "enmity/components";
import { React } from "enmity/metro/common";

interface SettingsProps {
	settings: SettingsStore;
}

export default function Settings({ settings }: SettingsProps) {
	React.useEffect(() =>
		() => {
			if (!settings.get("volume")) {
				settings.set("volume", "100")
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
		</FormSection>
	</ScrollView>;
}