import { useEffect, useState } from "react";
import { useAuth } from "@/auth";
import { Button } from "@/components/ui/button";

type QA = { id: string; q: string; answers: string[] };

export default function AutoReplies() {
  const { user, updateUser } = useAuth();
  const [list, setList] = useState<QA[]>([]);
  const [q, setQ] = useState("");
  const [initialAnswersText, setInitialAnswersText] = useState("");

  useEffect(() => {
    if (!user) return;
    const raw = localStorage.getItem(`tt_qas_${user.email}`);
    if (!raw) {
      setList([]);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const normalized = parsed.map((p: any) => ({
          id: p.id ?? Math.random().toString(36).slice(2),
          q: p.q ?? "",
          answers: p.answers ?? (p.a ? [p.a] : []),
        }));
        setList(normalized);
      } else {
        setList([]);
      }
    } catch (err) {
      console.error("Failed to parse stored auto-replies", err);
      setList([]);
    }
  }, [user]);

  const save = (next: QA[]) => {
    if (!user) return;
    localStorage.setItem(`tt_qas_${user.email}`, JSON.stringify(next));
    setList(next);
  };

  const add = () => {
    if (!q.trim()) return;
    const answers = initialAnswersText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const next = [
      ...list,
      {
        id: Math.random().toString(36).slice(2),
        q: q.trim(),
        answers,
      },
    ];
    save(next);
    setQ("");
    setInitialAnswersText("");
  };

  const remove = (id: string) => save(list.filter((x) => x.id !== id));
  const addAnswer = (id: string, ans: string) => {
    if (!ans.trim()) return;
    save(
      list.map((x) =>
        x.id === id ? { ...x, answers: [...x.answers, ans.trim()] } : x,
      ),
    );
  };
  const removeAnswer = (id: string, idx: number) => {
    save(
      list.map((x) =>
        x.id === id
          ? { ...x, answers: x.answers.filter((_, i) => i !== idx) }
          : x,
      ),
    );
  };
  const editQuestion = (id: string, nq: string) =>
    save(list.map((x) => (x.id === id ? { ...x, q: nq } : x)));
  const editAnswer = (id: string, idx: number, na: string) =>
    save(
      list.map((x) =>
        x.id === id
          ? { ...x, answers: x.answers.map((ans, i) => (i === idx ? na : ans)) }
          : x,
      ),
    );

  const exportJson = () => {
    const data = JSON.stringify(list, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const aEl = document.createElement("a");
    aEl.href = url;
    aEl.download = `torex_qas_${user?.email ?? "export"}.json`;
    aEl.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed)) {
          const normalized = parsed.map((p: any) => ({
            id: p.id ?? Math.random().toString(36).slice(2),
            q: p.q ?? "",
            answers: p.answers ?? (p.a ? [p.a] : []),
          }));
          save([...list, ...normalized]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsText(f);
  };

  if (!user)
    return <div className="container py-10">Iltimos tizimga kiring</div>;

  function EditableText({
    value,
    onSave,
  }: {
    value: string;
    onSave: (v: string) => void;
  }) {
    const [editing, setEditing] = useState(false);
    const [val, setVal] = useState(value);
    return editing ? (
      <div className="flex gap-2">
        <input
          className="rounded-md bg-secondary px-2 py-1"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
        <button
          onClick={() => {
            onSave(val);
            setEditing(false);
          }}
          className="px-2 py-1 rounded bg-primary text-primary-foreground"
        >
          Saqlash
        </button>
        <button
          onClick={() => {
            setVal(value);
            setEditing(false);
          }}
          className="px-2 py-1 rounded bg-secondary"
        >
          Bekor
        </button>
      </div>
    ) : (
      <div className="flex items-center gap-2">
        <div>{value}</div>
        <button
          onClick={() => setEditing(true)}
          className="text-xs text-muted-foreground underline"
        >
          Tahrirlash
        </button>
      </div>
    );
  }

  function AnswerList({
    item,
    onEdit,
    onRemove,
    onAdd,
  }: {
    item: QA;
    onEdit: (idx: number, val: string) => void;
    onRemove: (idx: number) => void;
    onAdd: (val: string) => void;
  }) {
    const [local, setLocal] = useState("");
    return (
      <div className="space-y-2">
        {item.answers.map((ans, idx) => (
          <div key={idx} className="flex items-center justify-between gap-2">
            <EditableText value={ans} onSave={(val) => onEdit(idx, val)} />
            <div className="flex items-center gap-2">
              <button
                onClick={() => onRemove(idx)}
                className="px-2 py-1 rounded bg-destructive text-destructive-foreground text-sm"
              >
                O'chirish
              </button>
            </div>
          </div>
        ))}
        <div className="flex gap-2 mt-2">
          <input
            placeholder="Yangi javob"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            className="flex-1 rounded-md bg-secondary px-3 py-2"
          />
          <button
            onClick={() => {
              onAdd(local);
              setLocal("");
            }}
            className="px-3 py-2 rounded bg-primary text-primary-foreground"
          >
            Javob qo'shish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">AI Avtojavoblar</h2>
          <div className="space-y-3">
            {list.map((item) => (
              <div key={item.id} className="border rounded p-3">
                <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                  <div className="flex-1">
                    <div className="font-medium mb-2">
                      Q:{" "}
                      <EditableText
                        value={item.q}
                        onSave={(val) => editQuestion(item.id, val)}
                      />
                    </div>
                    <div className="space-y-2">
                      <AnswerList
                        item={item}
                        onEdit={(idx, val) => editAnswer(item.id, idx, val)}
                        onRemove={(idx) => removeAnswer(item.id, idx)}
                        onAdd={(val) => addAnswer(item.id, val)}
                      />
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 sm:gap-3 mt-4 sm:mt-0">
                    <button
                      onClick={() => remove(item.id)}
                      className="px-2 py-1 rounded bg-destructive text-destructive-foreground"
                    >
                      O'chirish
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border p-4 bg-card">
          <h3 className="font-semibold mb-2">Yangi Q&A</h3>
          <input
            className="w-full rounded-md bg-secondary px-3 py-2 mb-2"
            placeholder="Savol"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <textarea
            className="w-full rounded-md bg-secondary px-3 py-2 mb-2"
            placeholder="Javob(lar) - har bir javob yangi qatorga"
            value={initialAnswersText}
            onChange={(e) => setInitialAnswersText(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              onClick={() => {
                const answers = initialAnswersText
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean);
                if (!q.trim()) return;
                const next = [
                  ...list,
                  {
                    id: Math.random().toString(36).slice(2),
                    q: q.trim(),
                    answers,
                  },
                ];
                save(next);
                setQ("");
                setInitialAnswersText("");
              }}
            >
              Qo'shish
            </Button>
            <Button variant="outline" onClick={exportJson}>
              Export
            </Button>
            <label className="px-3 py-2 rounded bg-secondary cursor-pointer">
              Import
              <input
                type="file"
                accept="application/json"
                onChange={importJson}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
