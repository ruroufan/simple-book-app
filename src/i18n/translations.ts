import type { ExpenseCategory, Language, PaymentMethod } from '../types';

type NavPage = 'dashboard' | 'list' | 'schedule' | 'stats' | 'settings';

type Translation = {
  appName: string;
  nav: Record<NavPage, string>;
  categories: Record<ExpenseCategory, string>;
  paymentMethods: Record<PaymentMethod, string>;
  dashboard: {
    title: string;
    monthTotal: string;
    recent: string;
    empty: string;
    add: string;
  };
  form: {
    createTitle: string;
    editTitle: string;
    amount: string;
    category: string;
    date: string;
    time: string;
    storeName: string;
    note: string;
    notePlaceholder: string;
    paymentMethod: string;
    receipt: string;
    receiptHelp: string;
    saveCreate: string;
    saveEdit: string;
    cancel: string;
    recognizing: string;
    recognized: string;
    unclear: string;
    required: string;
    autoClassifiedByMemory: string;
  };
  list: {
    title: string;
    empty: string;
    receipt: string;
  };
  detail: {
    title: string;
    back: string;
    edit: string;
    delete: string;
    deleteConfirm: string;
    receipt: string;
    noReceipt: string;
  };
  schedule: {
    title: string;
    addTitle: string;
    editTitle: string;
    detailTitle: string;
    deleteTitle: string;
    todayTitle: string;
    selectedScheduleTitle: string;
    selectedExpenseTitle: string;
    empty: string;
    noExpenses: string;
    titleField: string;
    dateField: string;
    startTimeField: string;
    endTimeField: string;
    noteField: string;
    syncField: string;
    addToPhoneCalendar: string;
    addToGoogleCalendar: string;
    saveCreate: string;
    saveEdit: string;
    requiredTitle: string;
    synced: string;
    notSynced: string;
    deleteConfirm: string;
  };
  stats: {
    title: string;
    month: string;
    monthTotal: string;
    todayTotal: string;
    monthCount: string;
    byCategory: string;
    last7Days: string;
    empty: string;
  };
  storeMemory: {
    title: string;
    entry: string;
    empty: string;
    useCount: string;
    lastUsedAt: string;
    delete: string;
  };
  feedback: {
    title: string;
    entry: string;
    type: string;
    message: string;
    messagePlaceholder: string;
    contact: string;
    contactPlaceholder: string;
    submit: string;
    submitting: string;
    success: string;
    failure: string;
    mailApp: string;
    copy: string;
    copied: string;
    options: {
      bug: string;
      receipt: string;
      dataLoss: string;
      suggestion: string;
      other: string;
    };
  };
  backup: {
    title: string;
    entry: string;
    sectionTitle: string;
    exportData: string;
    importData: string;
    restoreLocal: string;
    noLocalBackup: string;
    importConfirm: string;
    restored: string;
    exported: string;
    invalidFile: string;
    note: string;
  };
  cloudSync: {
    title: string;
    status: string;
    synced: string;
    syncing: string;
    pending: string;
    failed: string;
    disabled: string;
    lastSyncedAt: string;
    recoveryCode: string;
    copyRecoveryCode: string;
    copied: string;
    syncNow: string;
    restoreByCode: string;
    codePlaceholder: string;
    restoreConfirm: string;
    restoreSuccess: string;
    restoreNotFound: string;
    restoreFailed: string;
    envNote: string;
  };
  settings: {
    title: string;
    language: string;
    chinese: string;
    japanese: string;
    followSystem: string;
    storageNote: string;
  };
  install: {
    addToHome: string;
    iosHint: string;
    dismiss: string;
  };
  common: {
    yen: string;
    noStore: string;
  };
};

export const categoryKeys: ExpenseCategory[] = [
  'food',
  'clothing',
  'transport',
  'daily',
  'rent',
  'utilities',
  'entertainment',
  'medical',
  'other',
];

export const paymentMethodKeys: PaymentMethod[] = ['cash', 'creditCard', 'electronic'];

export const translations: Record<Language, Translation> = {
  zh: {
    appName: '简单记账',
    nav: {
      dashboard: '首页',
      list: '记账',
      schedule: '日程',
      stats: '统计',
      settings: '设置',
    },
    categories: {
      food: '吃饭',
      clothing: '穿衣',
      transport: '出行',
      daily: '日用品',
      rent: '房租',
      utilities: '水电煤',
      entertainment: '娱乐',
      medical: '医疗',
      other: '其他',
    },
    paymentMethods: {
      cash: '现金',
      creditCard: '信用卡',
      electronic: '电子支付',
    },
    dashboard: {
      title: '本月支出',
      monthTotal: '本月支出',
      recent: '最近记录',
      empty: '还没有记录，先记一笔吧。',
      add: '+ 记一笔',
    },
    form: {
      createTitle: '新增记录',
      editTitle: '编辑记录',
      amount: '金额',
      category: '分类',
      date: '日期',
      time: '时间',
      storeName: '店铺名',
      note: '备注',
      notePlaceholder: '例如：便利店、咖啡、交通',
      paymentMethod: '支付方式',
      receipt: '小票图片',
      receiptHelp: '选择图片后会自动识别金额、日期、店铺和分类。',
      saveCreate: '保存记录',
      saveEdit: '保存修改',
      cancel: '取消',
      recognizing: '正在识别小票...',
      recognized: '已自动填入识别结果',
      unclear: '小票识别不清楚，请手动确认金额和分类。',
      required: '请填写金额。',
      autoClassifiedByMemory: '已根据你的历史记录自动分类',
    },
    list: {
      title: '记账',
      empty: '暂无记录。',
      receipt: '有小票',
    },
    detail: {
      title: '记录详情',
      back: '返回',
      edit: '编辑',
      delete: '删除',
      deleteConfirm: '确定删除这条记录吗？',
      receipt: '小票图片',
      noReceipt: '没有小票图片',
    },
    schedule: {
      title: '日程',
      addTitle: '新增日程',
      editTitle: '编辑日程',
      detailTitle: '日程详情',
      deleteTitle: '删除日程',
      todayTitle: '今天的日程',
      selectedScheduleTitle: '当天日程',
      selectedExpenseTitle: '当天消费',
      empty: '没有日程',
      noExpenses: '没有消费记录',
      titleField: '标题',
      dateField: '日期',
      startTimeField: '开始时间',
      endTimeField: '结束时间',
      noteField: '备注',
      syncField: '同步到手机日历',
      addToPhoneCalendar: '添加到手机日历',
      addToGoogleCalendar: '添加到 Google Calendar',
      saveCreate: '保存日程',
      saveEdit: '保存修改',
      requiredTitle: '请填写标题。',
      synced: '已同步',
      notSynced: '未同步',
      deleteConfirm: '确定删除这条日程吗？',
    },
    stats: {
      title: '统计',
      month: '月份',
      monthTotal: '本月总支出',
      todayTotal: '今天支出',
      monthCount: '本月消费笔数',
      byCategory: '按分类',
      last7Days: '最近 7 天',
      empty: '本月暂无支出。',
    },
    storeMemory: {
      title: '店铺分类记忆',
      entry: '店铺分类记忆',
      empty: '还没有记住任何店铺分类。',
      useCount: '使用次数',
      lastUsedAt: '最后使用',
      delete: '删除',
    },
    feedback: {
      title: '问题反馈',
      entry: '问题反馈',
      type: '问题类型',
      message: '问题说明',
      messagePlaceholder: '请描述遇到的问题、所在页面、操作步骤和当时情况。',
      contact: '联系方式（选填）',
      contactPlaceholder: '邮箱或其他联系方式',
      submit: '提交反馈',
      submitting: '正在发送...',
      success: '已收到反馈，谢谢！',
      failure: '反馈发送失败，请稍后再试，或复制内容发送给开发者。',
      mailApp: '用邮件 App 发送',
      copy: '复制反馈内容',
      copied: '已复制',
      options: {
        bug: 'Bug 报错',
        receipt: '小票识别不准确',
        dataLoss: '数据丢失',
        suggestion: '功能建议',
        other: '其他',
      },
    },
    backup: {
      title: '数据备份与恢复',
      entry: '数据备份与恢复',
      sectionTitle: '本地数据',
      exportData: '导出数据',
      importData: '导入数据',
      restoreLocal: '从本机备份恢复',
      noLocalBackup: '暂无本机备份',
      importConfirm: '导入数据会覆盖当前本机数据，确定继续吗？',
      restored: '数据已恢复',
      exported: '已导出备份文件',
      invalidFile: '备份文件无法读取',
      note: '数据保存在当前浏览器本地。删除浏览器数据、卸载 PWA 或清除 Safari 网站数据可能会丢失记录，建议定期导出备份。',
    },
    cloudSync: {
      title: '云端同步',
      status: '同步状态',
      synced: '已同步',
      syncing: '同步中',
      pending: '等待同步',
      failed: '同步失败',
      disabled: '未配置云端同步',
      lastSyncedAt: '最后同步时间',
      recoveryCode: '我的恢复码',
      copyRecoveryCode: '复制恢复码',
      copied: '已复制',
      syncNow: '立即同步',
      restoreByCode: '通过恢复码恢复数据',
      codePlaceholder: '输入恢复码，例如 SB-8K29-XP73',
      restoreConfirm: '找到云端数据。恢复后会覆盖当前本机数据，确定继续吗？',
      restoreSuccess: '云端数据已恢复',
      restoreNotFound: '没有找到对应数据，请确认恢复码是否正确。',
      restoreFailed: '恢复失败，请稍后再试。',
      envNote: '配置 Supabase 环境变量后会自动同步。',
    },
    settings: {
      title: '设置',
      language: '语言',
      chinese: '中文',
      japanese: '日本語',
      followSystem: '跟随手机语言',
      storageNote: '记录、小票图片、日程和店铺记忆会保存在本机。建议定期导出备份。',
    },
    install: {
      addToHome: '添加到手机桌面',
      iosHint: '点击 Safari 底部分享按钮，然后选择「添加到主屏幕」',
      dismiss: '稍后',
    },
    common: {
      yen: '¥',
      noStore: '未填写',
    },
  },
  ja: {
    appName: 'シンプル家計簿',
    nav: {
      dashboard: 'ホーム',
      list: '記録',
      schedule: 'カレンダー',
      stats: '統計',
      settings: '設定',
    },
    categories: {
      food: '食費',
      clothing: '衣類',
      transport: '交通',
      daily: '日用品',
      rent: '家賃',
      utilities: '光熱費',
      entertainment: '娯楽',
      medical: '医療',
      other: 'その他',
    },
    paymentMethods: {
      cash: '現金',
      creditCard: 'クレジットカード',
      electronic: '電子決済',
    },
    dashboard: {
      title: '今月の支出',
      monthTotal: '今月の支出',
      recent: '最近の記録',
      empty: 'まだ記録がありません。',
      add: '+ 記録する',
    },
    form: {
      createTitle: '記録を追加',
      editTitle: '記録を編集',
      amount: '金額',
      category: 'カテゴリ',
      date: '日付',
      time: '時間',
      storeName: '店名',
      note: 'メモ',
      notePlaceholder: '例：コンビニ、カフェ、交通',
      paymentMethod: '支払い方法',
      receipt: 'レシート画像',
      receiptHelp: '画像を選ぶと金額、日付、店名、カテゴリを認識します。',
      saveCreate: '保存',
      saveEdit: '変更を保存',
      cancel: 'キャンセル',
      recognizing: 'レシートを認識中...',
      recognized: '認識結果を入力しました',
      unclear: 'レシートの認識が不明瞭です。金額とカテゴリを確認してください。',
      required: '金額を入力してください。',
      autoClassifiedByMemory: '過去の記録に基づいて自動分類しました',
    },
    list: {
      title: '記録',
      empty: '記録はまだありません。',
      receipt: 'レシートあり',
    },
    detail: {
      title: '記録詳細',
      back: '戻る',
      edit: '編集',
      delete: '削除',
      deleteConfirm: 'この記録を削除しますか？',
      receipt: 'レシート画像',
      noReceipt: 'レシート画像はありません',
    },
    schedule: {
      title: 'カレンダー',
      addTitle: '予定を追加',
      editTitle: '予定を編集',
      detailTitle: '予定詳細',
      deleteTitle: '予定を削除',
      todayTitle: '今日の予定',
      selectedScheduleTitle: '当日の予定',
      selectedExpenseTitle: '当日の支出',
      empty: '予定はありません',
      noExpenses: '支出はありません',
      titleField: 'タイトル',
      dateField: '日付',
      startTimeField: '開始時間',
      endTimeField: '終了時間',
      noteField: 'メモ',
      syncField: 'スマホカレンダーに同期',
      addToPhoneCalendar: 'スマホカレンダーに追加',
      addToGoogleCalendar: 'Google カレンダーに追加',
      saveCreate: '保存',
      saveEdit: '変更を保存',
      requiredTitle: 'タイトルを入力してください。',
      synced: '同期済み',
      notSynced: '未同期',
      deleteConfirm: 'この予定を削除しますか？',
    },
    stats: {
      title: '統計',
      month: '月',
      monthTotal: '今月の合計',
      todayTotal: '今日の支出',
      monthCount: '今月の記録数',
      byCategory: 'カテゴリ別',
      last7Days: '直近 7 日',
      empty: '今月の支出はありません。',
    },
    storeMemory: {
      title: '店舗カテゴリ記憶',
      entry: '店舗カテゴリ記憶',
      empty: '記憶した店舗カテゴリはまだありません。',
      useCount: '使用回数',
      lastUsedAt: '最終使用',
      delete: '削除',
    },
    feedback: {
      title: '不具合報告',
      entry: '不具合報告',
      type: '種類',
      message: '内容',
      messagePlaceholder: '問題、画面、操作、発生した状況を入力してください。',
      contact: '連絡先（任意）',
      contactPlaceholder: 'メールアドレスなど',
      submit: '送信する',
      submitting: '送信中...',
      success: 'ご報告ありがとうございます。',
      failure: '送信に失敗しました。あとでもう一度試すか、内容をコピーして開発者に送ってください。',
      mailApp: 'メールアプリで送信',
      copy: '内容をコピー',
      copied: 'コピーしました',
      options: {
        bug: '不具合',
        receipt: 'レシート認識が不正確',
        dataLoss: 'データが消えた',
        suggestion: '機能要望',
        other: 'その他',
      },
    },
    backup: {
      title: 'データのバックアップと復元',
      entry: 'データのバックアップと復元',
      sectionTitle: '端末内データ',
      exportData: 'データを書き出す',
      importData: 'データを読み込む',
      restoreLocal: '端末内バックアップから復元',
      noLocalBackup: '端末内バックアップはありません',
      importConfirm: '読み込むと現在の端末内データが上書きされます。続行しますか？',
      restored: 'データを復元しました',
      exported: 'バックアップを書き出しました',
      invalidFile: 'バックアップファイルを読み込めません',
      note: 'データはこのブラウザ内に保存されます。ブラウザデータの削除、PWA の削除、Safari の Web サイトデータ削除で記録が消える場合があります。定期的な書き出しをおすすめします。',
    },
    cloudSync: {
      title: 'クラウド同期',
      status: '同期状態',
      synced: '同期済み',
      syncing: '同期中',
      pending: '同期待ち',
      failed: '同期に失敗しました',
      disabled: 'クラウド同期は未設定です',
      lastSyncedAt: '最終同期時刻',
      recoveryCode: '復元コード',
      copyRecoveryCode: '復元コードをコピー',
      copied: 'コピーしました',
      syncNow: '今すぐ同期',
      restoreByCode: '復元コードでデータを復元',
      codePlaceholder: '復元コードを入力（例：SB-8K29-XP73）',
      restoreConfirm: 'クラウドデータが見つかりました。復元すると現在の端末内データが上書きされます。続行しますか？',
      restoreSuccess: 'クラウドデータを復元しました',
      restoreNotFound: '該当するデータが見つかりません。復元コードを確認してください。',
      restoreFailed: '復元に失敗しました。あとでもう一度試してください。',
      envNote: 'Supabase の環境変数を設定すると自動同期されます。',
    },
    settings: {
      title: '設定',
      language: '言語',
      chinese: '中文',
      japanese: '日本語',
      followSystem: '端末の言語に合わせる',
      storageNote: '記録、画像、予定、店舗記憶は端末内に保存されます。定期的なバックアップをおすすめします。',
    },
    install: {
      addToHome: 'ホーム画面に追加',
      iosHint: 'Safari の共有ボタンをタップし、「ホーム画面に追加」を選択してください',
      dismiss: 'あとで',
    },
    common: {
      yen: '¥',
      noStore: '未入力',
    },
  },
};
