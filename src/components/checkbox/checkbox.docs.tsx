import { ArgTypes } from "@storybook/addon-docs/blocks";
import { styled } from "@styled/jsx";
import {
  DocsCaption,
  DocsContainer,
  DocsDivider,
  DocsHeading,
  DocsList,
  DocsLabel,
  DocsStateRow,
  DocsSubheading,
  DocsTable,
  DocsText,
  DocsTitle,
  DocsVariantGroup,
} from "../../../.storybook/docs-components";
import { Checkbox } from "./checkbox";

const HelperTextGroup = styled("div", {
  base: { display: "flex", flexDirection: "column", gap: "4" },
});

export function CheckboxDocsPage() {
  return (
    <DocsContainer>
      {/* タイトル + 概要 */}
      <DocsTitle>Checkbox</DocsTitle>
      <DocsText>
        ユーザーが 1 つ以上の選択肢をオン・オフするためのフォーム要素。設定の切り替え、利用規約への同意、複数項目の一括選択などに使用する。
      </DocsText>
      <DocsCaption>
        状態: unchecked / checked / indeterminate / disabled
      </DocsCaption>

      <DocsDivider />

      {/* いつ使うか / いつ使わないか */}
      <DocsHeading>いつ使うか</DocsHeading>
      <DocsList>
        <li>複数の選択肢から 0 個以上を選ぶ場面（例: フィルタ、設定項目）</li>
        <li>単一の設定をオン・オフで切り替える場面（例: 「メール通知を受け取る」）</li>
        <li>利用規約やプライバシーポリシーへの同意を求める場面</li>
        <li>リスト内の全項目を一括選択・解除する場面（indeterminate 状態を含む）</li>
      </DocsList>

      <DocsHeading>いつ使わないか</DocsHeading>
      <DocsList>
        <li>即座に効果が反映される設定 — Switch を使用する</li>
        <li>排他的な選択肢（1 つだけ選ぶ） — RadioGroup を使用する</li>
        <li>アクションの起動 — Button を使用する</li>
      </DocsList>

      <DocsDivider />

      {/* 状態 */}
      <DocsHeading>状態</DocsHeading>

      <DocsVariantGroup>
        <DocsStateRow>
          <DocsLabel>Unchecked</DocsLabel>
          <Checkbox label="未選択" />
        </DocsStateRow>
        <DocsStateRow>
          <DocsLabel>Checked</DocsLabel>
          <Checkbox label="選択済み" defaultChecked />
        </DocsStateRow>
        <DocsStateRow>
          <DocsLabel>Indeterminate</DocsLabel>
          <Checkbox label="一部選択" defaultChecked="indeterminate" />
        </DocsStateRow>
        <DocsStateRow>
          <DocsLabel>Disabled</DocsLabel>
          <Checkbox label="無効" disabled />
        </DocsStateRow>
        <DocsStateRow>
          <DocsLabel>Disabled + Checked</DocsLabel>
          <Checkbox label="無効（選択済み）" disabled defaultChecked />
        </DocsStateRow>
        <DocsStateRow>
          <DocsLabel>Disabled + Indeterminate</DocsLabel>
          <Checkbox label="無効（一部選択）" disabled defaultChecked="indeterminate" />
        </DocsStateRow>
      </DocsVariantGroup>

      <DocsDivider />

      {/* ヘルパーテキスト */}
      <DocsHeading>ヘルパーテキスト</DocsHeading>
      <DocsText>
        helperText を指定すると、チェックボックスの下に補足説明を表示できる。
      </DocsText>
      <HelperTextGroup>
        <Checkbox
          label="メール通知を受け取る"
          helperText="新着情報やアップデートをメールでお届けします"
        />
        <Checkbox
          label="利用規約に同意する"
          helperText="サービスの利用には同意が必要です"
        />
        <Checkbox
          label="無効な項目"
          helperText="この設定は現在変更できません"
          disabled
        />
      </HelperTextGroup>

      <DocsDivider />

      {/* Do / Don't */}
      <DocsHeading>Do / Don&apos;t</DocsHeading>
      <DocsTable>
        <thead>
          <tr>
            <th>Do</th>
            <th>Don&apos;t</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ラベルは肯定的な表現にする（「通知を受け取る」）</td>
            <td>二重否定を使う（「通知を無効にしない」）</td>
          </tr>
          <tr>
            <td>親子関係には indeterminate 状態を使う</td>
            <td>indeterminate をチェック済みの代わりに使う</td>
          </tr>
          <tr>
            <td>disabled 時にその理由を近くに提示する</td>
            <td>disabled チェックボックスを説明なく表示する</td>
          </tr>
          <tr>
            <td>即座に反映しない設定の切り替えに使う</td>
            <td>即座に効果が反映される設定に使う（Switch を使用する）</td>
          </tr>
          <tr>
            <td>グループ内で縦に並べて視認性を確保する</td>
            <td>横並びで多数のチェックボックスを配置する</td>
          </tr>
        </tbody>
      </DocsTable>

      <DocsDivider />

      {/* アクセシビリティ */}
      <DocsHeading>アクセシビリティ</DocsHeading>

      <DocsSubheading>キーボード操作</DocsSubheading>
      <DocsTable>
        <thead>
          <tr>
            <th>キー</th>
            <th>動作</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Space</td>
            <td>チェック状態を切り替える</td>
          </tr>
          <tr>
            <td>Tab</td>
            <td>次のフォーカス可能な要素に移動する</td>
          </tr>
        </tbody>
      </DocsTable>

      <DocsSubheading>ARIA 属性</DocsSubheading>
      <DocsTable>
        <thead>
          <tr>
            <th>属性</th>
            <th>条件</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>role=&quot;checkbox&quot;</td>
            <td>常時</td>
            <td>HiddenInput によりネイティブ checkbox が提供される</td>
          </tr>
          <tr>
            <td>aria-checked=&quot;true&quot;</td>
            <td>チェック時</td>
            <td>選択状態であることを支援技術に伝える</td>
          </tr>
          <tr>
            <td>aria-checked=&quot;mixed&quot;</td>
            <td>indeterminate 時</td>
            <td>部分選択状態であることを伝える</td>
          </tr>
          <tr>
            <td>aria-describedby</td>
            <td>helperText 指定時</td>
            <td>Field が自動で HelperText と hidden input を紐付ける</td>
          </tr>
          <tr>
            <td>aria-disabled</td>
            <td>disabled 時</td>
            <td>操作不可であることを支援技術に伝える（フォーカスは維持される）</td>
          </tr>
          <tr>
            <td>data-state</td>
            <td>常時</td>
            <td>checked / unchecked / indeterminate を CSS セレクタで参照可能</td>
          </tr>
        </tbody>
      </DocsTable>

      <DocsSubheading>フォーカスリング</DocsSubheading>
      <DocsText>
        キーボード操作時（focus-visible）にコントロール外側に 2px のアウトラインが表示される。outlineOffset: 2px で要素外側に描画される。
      </DocsText>

      <DocsDivider />

      {/* Props */}
      <DocsHeading>Props</DocsHeading>
      <ArgTypes />
    </DocsContainer>
  );
}
