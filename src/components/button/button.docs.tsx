import { ArgTypes } from "@storybook/addon-docs/blocks";
import {
  DocsCaption,
  DocsContainer,
  DocsDivider,
  DocsHeading,
  DocsLabel,
  DocsList,
  DocsRow,
  DocsSizeLabel,
  DocsStateRow,
  DocsSubheading,
  DocsTable,
  DocsText,
  DocsTitle,
  DocsVariantGroup,
} from "../../../.storybook/docs-components";
import { Button } from "./button";

function SizeRow({
  variant,
  colorScheme,
}: {
  variant: "solid" | "outline" | "ghost";
  colorScheme: "brand" | "danger";
}) {
  return (
    <DocsRow>
      <DocsSizeLabel>sm</DocsSizeLabel>
      <Button variant={variant} colorScheme={colorScheme} size="sm">
        Button
      </Button>
      <DocsSizeLabel>md</DocsSizeLabel>
      <Button variant={variant} colorScheme={colorScheme} size="md">
        Button
      </Button>
      <DocsSizeLabel>lg</DocsSizeLabel>
      <Button variant={variant} colorScheme={colorScheme} size="lg">
        Button
      </Button>
    </DocsRow>
  );
}

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2Z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06l2.97-2.97H3a.75.75 0 0 1 0-1.5h8.19L8.22 4.03a.75.75 0 0 1 0-1.06Z"
    />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

export function ButtonDocsPage() {
  return (
    <DocsContainer>
      <DocsTitle>Button</DocsTitle>
      <DocsText>
        ユーザーのアクションを受け付けるための汎用ボタンコンポーネント。フォーム送信、ダイアログの操作、機能の実行など、クリックによるインタラクションに使用する。
      </DocsText>

      <DocsDivider />

      <DocsHeading>いつ使うか</DocsHeading>
      <DocsList>
        <li>フォームの送信やキャンセルなど、明確なアクションを実行するとき</li>
        <li>ダイアログやモーダルの確認・取消操作</li>
        <li>ページ内の機能トリガー（保存、削除、エクスポートなど）</li>
      </DocsList>

      <DocsHeading>いつ使わないか</DocsHeading>
      <DocsList>
        <li>
          別のページへの遷移には &lt;a&gt; タグやリンクコンポーネントを使う
        </li>
        <li>テキスト中のインラインリンクには使わない</li>
        <li>
          メニューやトグルなど、専用の UI コンポーネントがある場合はそちらを使う
        </li>
      </DocsList>

      <DocsDivider />

      <DocsHeading>Solid</DocsHeading>
      <DocsCaption>もっとも視覚的に強調されるメインアクション</DocsCaption>
      <DocsVariantGroup>
        <SizeRow variant="solid" colorScheme="brand" />
        <SizeRow variant="solid" colorScheme="danger" />
      </DocsVariantGroup>

      <DocsDivider />

      <DocsHeading>Outline</DocsHeading>
      <DocsCaption>中程度の強調で使うサブアクション</DocsCaption>
      <DocsVariantGroup>
        <SizeRow variant="outline" colorScheme="brand" />
        <SizeRow variant="outline" colorScheme="danger" />
      </DocsVariantGroup>

      <DocsDivider />

      <DocsHeading>Ghost</DocsHeading>
      <DocsCaption>もっとも控えめな補助的アクション</DocsCaption>
      <DocsVariantGroup>
        <SizeRow variant="ghost" colorScheme="brand" />
        <SizeRow variant="ghost" colorScheme="danger" />
      </DocsVariantGroup>

      <DocsDivider />

      <DocsHeading>状態</DocsHeading>
      <DocsStateRow>
        <DocsLabel>デフォルト</DocsLabel>
        <Button>Save</Button>
        <DocsLabel>無効</DocsLabel>
        <Button disabled>Save</Button>
        <DocsLabel>ローディング</DocsLabel>
        <Button loading>Saving...</Button>
      </DocsStateRow>

      <DocsDivider />

      <DocsHeading>アイコン</DocsHeading>
      <DocsCaption>
        leftIcon / rightIcon で指定。アイコンのみの場合は aria-label が必須。
      </DocsCaption>
      <DocsRow>
        <Button leftIcon={<PlusIcon />}>作成</Button>
        <Button rightIcon={<ArrowRightIcon />}>次へ</Button>
        <Button leftIcon={<CloseIcon />} aria-label="閉じる" />
        <DocsLabel>← aria-label 必須</DocsLabel>
      </DocsRow>

      <DocsDivider />

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
            <td>1つの画面で solid は主要アクション1つに絞る</td>
            <td>主要アクションを複数の solid ボタンで並べない</td>
          </tr>
          <tr>
            <td>ラベルは「保存」「削除」など具体的な動詞にする</td>
            <td>「こちら」「クリック」など曖昧なラベルにしない</td>
          </tr>
          <tr>
            <td>icon-only ボタンには aria-label を必ず付ける</td>
            <td>icon-only ボタンで aria-label を省略しない</td>
          </tr>
          <tr>
            <td>破壊的操作には colorScheme=&quot;danger&quot; を使う</td>
            <td>通常の操作に danger カラーを使わない</td>
          </tr>
          <tr>
            <td>loading 中はユーザーに処理中であることを伝える</td>
            <td>loading 中にボタンを非表示にしない</td>
          </tr>
          <tr>
            <td>
              type=&quot;button&quot; をデフォルトとして意図的に submit を指定する
            </td>
            <td>フォーム外のボタンに type=&quot;submit&quot; を使わない</td>
          </tr>
        </tbody>
      </DocsTable>

      <DocsDivider />

      <DocsHeading>アクセシビリティ</DocsHeading>

      <DocsSubheading>キーボード操作</DocsSubheading>
      <DocsList>
        <li>Enter / Space キーでボタンをクリックできる</li>
        <li>Tab キーでフォーカスを移動できる</li>
      </DocsList>

      <DocsSubheading>ARIA 属性</DocsSubheading>
      <DocsList>
        <li>無効化時は aria-disabled=&quot;true&quot; が設定される</li>
        <li>
          ローディング時は aria-busy=&quot;true&quot;
          でスクリーンリーダーに処理中であることを通知する
        </li>
        <li>icon-only ボタンでは aria-label を必ず指定すること</li>
        <li>アイコン・スピナーには aria-hidden=&quot;true&quot; が設定される</li>
      </DocsList>

      <DocsSubheading>フォーカス管理</DocsSubheading>
      <DocsList>
        <li>:focus-visible でフォーカスリングを表示（2px solid、2px オフセット）</li>
        <li>マウスクリック時にはフォーカスリングを表示しない</li>
      </DocsList>

      <DocsDivider />

      <DocsHeading>Props</DocsHeading>
      <ArgTypes />
    </DocsContainer>
  );
}
