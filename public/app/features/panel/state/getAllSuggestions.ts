import { PanelData, VisualizationSuggestion, VisualizationSuggestionsBuilder, PanelModel } from '@grafana/data';
import { importPanelPlugin } from 'app/features/plugins/importPanelPlugin';

export const panelsToCheckFirst = [
  'timeseries',
  'barchart',
  'gauge',
  'stat',
  'piechart',
  'bargauge',
  'table',
  'state-timeline',
  'status-history',
  'text',
  'dashlist',
  'logs',
];

export async function getAllSuggestions(data?: PanelData, panel?: PanelModel): Promise<VisualizationSuggestion[]> {
  const builder = new VisualizationSuggestionsBuilder(data, panel);

  for (const pluginId of panelsToCheckFirst) {
    const plugin = await importPanelPlugin(pluginId);
    const supplier = plugin.getSuggestionsSupplier();

    if (supplier) {
      supplier.getSuggestionsForData(builder);
    }
  }

  return builder.getList().sort((a, b) => {
    return (b.score ?? 0) - (a.score ?? 0);
  });
}
